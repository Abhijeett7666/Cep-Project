"""
Unit Tests for Community Cleanliness & Waste Awareness Web Application
======================================================================
Automated test suite covering Flask routes, form validation, CSV persistence,
search filtering, and error resilience using Python's built-in `unittest` module.
All file-based operations utilize temporary files to protect production CSV records.
"""

import csv
import os
import sys
import tempfile
import unittest

# Ensure parent directory is in python search path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import app as web_app


class TestDataAndConstants(unittest.TestCase):
    """Verifies that all educational constants and categories fulfill the project brief."""

    def test_waste_categories_coverage(self):
        """Must have exactly 5 core waste categories with definitions, examples, and municipal notes."""
        categories = web_app.WASTE_CATEGORIES
        self.assertEqual(len(categories), 5)
        required_fields = ["id", "title", "definition", "examples", "handling", "precautions", "municipal_note"]
        for cat in categories:
            for field in required_fields:
                self.assertIn(field, cat, f"Category missing {field}")
                self.assertTrue(len(cat[field]) > 0, f"Category has empty {field}")

    def test_environmental_tips_count_and_areas(self):
        """Must contain at least 15 practical tips across all mandatory environmental areas."""
        tips = web_app.ENVIRONMENTAL_TIPS
        self.assertGreaterEqual(len(tips), 15)

        required_areas = {
            "Reducing Single-Use Plastic",
            "Saving Water",
            "Conserving Electricity",
            "Recycling and Reusing Materials",
            "Keeping Public Places Clean",
            "Composting Suitable Organic Waste",
            "Responsible E-Waste Disposal"
        }
        present_areas = {tip["area"] for tip in tips}
        for area in required_areas:
            self.assertIn(area, present_areas, f"Missing required tip area: {area}")

    def test_issue_types_list(self):
        """Must define the 6 standard community issue types."""
        expected_types = [
            "Littering",
            "Overflowing Dustbin",
            "Improper Waste Segregation",
            "Plastic Pollution",
            "Drainage / Stagnant Water Issue",
            "Other Environmental Issue"
        ]
        self.assertEqual(web_app.ISSUE_TYPES, expected_types)


class TestCSVHelpers(unittest.TestCase):
    """Tests for CSV initialization, ID sequencing, saving, and robust reading."""

    def setUp(self):
        self.test_dir = tempfile.TemporaryDirectory()
        self.test_csv = os.path.join(self.test_dir.name, "test_reports.csv")

    def tearDown(self):
        self.test_dir.cleanup()

    def test_ensure_csv_file_creation(self):
        """Should create the file with standard headers if it does not exist."""
        self.assertFalse(os.path.exists(self.test_csv))
        created = web_app.ensure_csv_file(self.test_csv)
        self.assertTrue(created)
        self.assertTrue(os.path.exists(self.test_csv))

        # Check headers
        with open(self.test_csv, mode="r", newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader)
            self.assertEqual(header, web_app.CSV_HEADERS)

    def test_sequential_id_generation(self):
        """IDs must start at ENV-0001 and increment sequentially without collision."""
        self.assertEqual(web_app.get_next_report_id(self.test_csv), "ENV-0001")

        web_app.save_report("Central Canteen", "Littering", "Plastic cups", self.test_csv)
        self.assertEqual(web_app.get_next_report_id(self.test_csv), "ENV-0002")

        web_app.save_report("Sports Complex", "Overflowing Dustbin", "", self.test_csv)
        self.assertEqual(web_app.get_next_report_id(self.test_csv), "ENV-0003")

    def test_save_report_validation_and_writing(self):
        """Valid report must append properly and support optional empty description."""
        success, r_id, msg = web_app.save_report(
            location="Hostel Block B",
            issue_type="Drainage / Stagnant Water Issue",
            description="Stagnant puddle near water cooler",
            file_path=self.test_csv,
            timestamp="2026-10-15 12:00:00"
        )
        self.assertTrue(success)
        self.assertEqual(r_id, "ENV-0001")

        reports, malformed = web_app.get_all_reports(self.test_csv)
        self.assertEqual(len(reports), 1)
        self.assertEqual(malformed, 0)
        self.assertEqual(reports[0]["location"], "Hostel Block B")
        self.assertEqual(reports[0]["issue_type"], "Drainage / Stagnant Water Issue")
        self.assertEqual(reports[0]["description"], "Stagnant puddle near water cooler")

    def test_save_report_invalid_location(self):
        """Empty or whitespace-only locations must be rejected."""
        success, r_id, err = web_app.save_report("   ", "Littering", "", self.test_csv)
        self.assertFalse(success)
        self.assertIn("Location is required", err)

        success, r_id, err = web_app.save_report("A", "Littering", "", self.test_csv)
        self.assertFalse(success)
        self.assertIn("at least 2 characters", err)

    def test_save_report_invalid_issue_type(self):
        """Unrecognized issue types must be rejected."""
        success, r_id, err = web_app.save_report("Main Street", "Alien Debris", "", self.test_csv)
        self.assertFalse(success)
        self.assertIn("valid issue type", err)

    def test_read_malformed_csv_graceful(self):
        """Malformed or incomplete lines in CSV must be skipped without crashing."""
        with open(self.test_csv, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(web_app.CSV_HEADERS)
            writer.writerow(["ENV-0001", "2026-10-15 10:00:00", "Lawn", "Littering", "Bottles"])
            # Incomplete row
            writer.writerow(["ENV-0002", "Corrupt row with only 2 columns"])
            # Completely blank row
            writer.writerow(["", "", "", "", ""])
            writer.writerow(["ENV-0003", "2026-10-15 10:10:00", "Gate", "Plastic Pollution", "Bags"])

        reports, malformed_count = web_app.get_all_reports(self.test_csv)
        self.assertEqual(len(reports), 2)
        self.assertEqual(malformed_count, 1)
        # Newest first sorting
        self.assertEqual(reports[0]["id"], "ENV-0003")
        self.assertEqual(reports[1]["id"], "ENV-0001")


class TestFlaskWebRoutes(unittest.TestCase):
    """End-to-end route tests using Flask's test client."""

    def setUp(self):
        self.test_dir = tempfile.TemporaryDirectory()
        self.test_csv = os.path.join(self.test_dir.name, "flask_test_reports.csv")

        # Temporarily redirect DEFAULT_CSV_FILE to our temporary test CSV
        self.original_csv = web_app.DEFAULT_CSV_FILE
        web_app.DEFAULT_CSV_FILE = self.test_csv

        web_app.app.config["TESTING"] = True
        web_app.app.config["WTF_CSRF_ENABLED"] = False
        self.client = web_app.app.test_client()

    def tearDown(self):
        web_app.DEFAULT_CSV_FILE = self.original_csv
        self.test_dir.cleanup()

    def test_index_route(self):
        """Home page should return 200 and contain core branding and statistics."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")
        self.assertIn("Community Cleanliness", html)
        self.assertIn("Waste Awareness System", html)
        self.assertIn("Waste Segregation Guide", html)
        self.assertIn("Environmental Tips Hub", html)

    def test_segregation_guide_route(self):
        """Segregation guide route must render all 5 categories and municipal notice."""
        response = self.client.get("/segregation")
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")
        self.assertIn("Wet Waste", html)
        self.assertIn("Dry Recyclable Waste", html)
        self.assertIn("E-Waste", html)
        self.assertIn("Hazardous Household Waste", html)
        self.assertIn("Special Waste", html)
        self.assertIn("Municipal Notice & Variance Disclaimer", html)

    def test_tips_route(self):
        """Tips route must display practical tips and spotlight card."""
        response = self.client.get("/tips")
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")
        self.assertIn("Environmental Tips Hub", html)
        self.assertIn("Featured Action", html)
        self.assertIn("Plastic Reduction", html)
        self.assertIn("Water Conservation", html)

    def test_report_issue_get_form(self):
        """GET /report renders the clean form with required inputs and disclaimer."""
        response = self.client.get("/report")
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")
        self.assertIn("Report a Cleanliness or Environmental Issue", html)
        self.assertIn('name="location"', html)
        self.assertIn('name="issue_type"', html)
        self.assertIn('name="description"', html)
        self.assertIn("Local Academic Prototype", html)

    def test_report_issue_post_valid_redirects_and_persists(self):
        """POST /report with valid data redirects to /reports and flashes success."""
        form_payload = {
            "location": "Chemistry Lab Backyard",
            "issue_type": "Improper Waste Segregation",
            "description": "Chemical reagent bottles mixed with cardboard boxes"
        }
        response = self.client.post("/report", data=form_payload, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")

        # Success banner in view_reports page
        self.assertIn("Report Submitted Successfully!", html)
        self.assertIn("ENV-0001", html)
        self.assertIn("Chemistry Lab Backyard", html)

        # Check CSV content
        reports, _ = web_app.get_all_reports(self.test_csv)
        self.assertEqual(len(reports), 1)
        self.assertEqual(reports[0]["id"], "ENV-0001")

    def test_report_issue_post_empty_location_rejects(self):
        """POST /report with empty location stays on form page and shows error."""
        form_payload = {
            "location": "   ",
            "issue_type": "Littering",
            "description": "Some description"
        }
        response = self.client.post("/report", data=form_payload, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")
        self.assertIn("Location is required", html)

        # Confirm nothing was written to CSV
        reports, _ = web_app.get_all_reports(self.test_csv)
        self.assertEqual(len(reports), 0)

    def test_view_reports_empty_state(self):
        """GET /reports displays a friendly empty state when no reports have been recorded."""
        response = self.client.get("/reports")
        self.assertEqual(response.status_code, 200)
        html = response.data.decode("utf-8")
        self.assertIn("No community reports submitted yet!", html)

    def test_view_reports_with_data_and_filtering(self):
        """GET /reports lists records and correctly filters by query parameters."""
        web_app.save_report("Library Lawn", "Plastic Pollution", "Wrappers", self.test_csv)
        web_app.save_report("Admin Office", "Overflowing Dustbin", "Paper overflow", self.test_csv)

        # Unfiltered
        res_all = self.client.get("/reports")
        self.assertEqual(res_all.status_code, 200)
        html_all = res_all.data.decode("utf-8")
        self.assertIn("Library Lawn", html_all)
        self.assertIn("Admin Office", html_all)

        # Filter by location query 'Library'
        res_filtered = self.client.get("/reports?q=Library")
        html_filtered = res_filtered.data.decode("utf-8")
        self.assertIn("Library Lawn", html_filtered)
        self.assertNotIn("Admin Office", html_filtered)

        # Filter by issue type
        res_type = self.client.get("/reports?type=Overflowing+Dustbin")
        html_type = res_type.data.decode("utf-8")
        self.assertIn("Admin Office", html_type)
        self.assertNotIn("Library Lawn", html_type)

    def test_api_reports_endpoint(self):
        """GET /api/reports returns valid JSON with report status and count."""
        web_app.save_report("North Gate", "Littering", "Empty cans", self.test_csv)
        response = self.client.get("/api/reports")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["reports"][0]["id"], "ENV-0001")


if __name__ == "__main__":
    unittest.main()
