"""
Community Cleanliness & Waste Awareness System - Web Application
=================================================================
Flask web application for waste segregation education, eco-friendly tips,
and local community cleanliness issue reporting with local CSV persistence.

Author: Senior Python Full-Stack Architect & Technical Mentor
Academic Level: College Mini-Project / Software Engineering Viva
"""

import csv
import datetime
import os
import pathlib
from typing import Dict, List, Optional, Tuple
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

# -----------------------------------------------------------------------------
# Configuration & Paths
# -----------------------------------------------------------------------------

BASE_DIR = pathlib.Path(__file__).resolve().parent
DEFAULT_CSV_FILE = str(BASE_DIR / "reports.csv")
CSV_HEADERS = ["Report ID", "Timestamp", "Location", "Issue Type", "Description"]

app = Flask(__name__)
# Secret key for Flask session and flash messaging
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "community-cleanliness-secret-2026")


# -----------------------------------------------------------------------------
# Educational Constants & Datasets
# -----------------------------------------------------------------------------

WASTE_CATEGORIES = [
    {
        "id": "wet-waste",
        "title": "Wet Waste (Biodegradable)",
        "badge": "Organic & Compostable",
        "color": "success",
        "icon": "bi-leaf",
        "definition": (
            "Organic waste originating from plant or animal sources that breaks down naturally "
            "through biological decomposition into rich organic matter."
        ),
        "examples": [
            "Kitchen food scraps, fruit rinds, and vegetable peels",
            "Leftover cooked meals, bread, and eggshells",
            "Used tea leaves, coffee grounds, and nutshells",
            "Garden clippings, dried leaves, and wilted flowers"
        ],
        "handling": (
            "Collect inside a dedicated green bin. Drain excess water and gravies before disposal "
            "to prevent noxious odors and liquid seepage (leachate). Use for household composting or "
            "community organic waste converters."
        ),
        "precautions": (
            "Always keep bins covered to avoid pest attraction. Never mix plastics, glass, or pet feces "
            "into organic compostable waste."
        ),
        "municipal_note": (
            "Municipal collection schedules vary. Many civic bodies collect wet waste daily. "
            "Always verify your local municipality's green bin pickup rules."
        )
    },
    {
        "id": "dry-waste",
        "title": "Dry Recyclable Waste",
        "badge": "Recyclable",
        "color": "primary",
        "icon": "bi-recycle",
        "definition": (
            "Clean, non-biodegradable materials that can be sorted, shredded, or melted down and "
            "re-manufactured into new commercial goods."
        ),
        "examples": [
            "Newspapers, notebooks, cardboard boxes, and carton packaging",
            "Rinsed plastic beverage bottles, food containers, and jugs",
            "Glass bottles and clean sauce jars",
            "Tin cans, beverage cans, aluminum foil, and metal caps"
        ],
        "handling": (
            "Clean and air-dry containers before binning to eliminate food contamination. "
            "Flatten cardboard cartons and crush beverage bottles to conserve bin volume. "
            "Keep inside a blue bin."
        ),
        "precautions": (
            "Wrap shattered glass bottles or sharp metal lids inside thick paper before disposal "
            "to safeguard waste handlers from cuts."
        ),
        "municipal_note": (
            "Not all plastics are universally recyclable. Recycling eligibility depends on local "
            "Material Recovery Facility (MRF) infrastructure."
        )
    },
    {
        "id": "e-waste",
        "title": "E-Waste (Electronic Waste)",
        "badge": "Special Recovery",
        "color": "warning",
        "icon": "bi-cpu",
        "definition": (
            "Discarded electrical and electronic appliances, components, and gadgets that have reached "
            "the end of their functional utility."
        ),
        "examples": [
            "Smartphones, chargers, cables, and power adapters",
            "Laptops, computer peripherals, and keyboards",
            "Dry cell batteries, lithium-ion battery packs, and button cells",
            "CFL bulbs, LED tubelights, and printed circuit boards (PCBs)"
        ],
        "handling": (
            "Store separately in a clean, moisture-free container. Never dispose of e-waste in general "
            "household trash or set it on fire. Hand it over to certified e-waste drives or authorized collection kiosks."
        ),
        "precautions": (
            "Never dismantle batteries or circuit boards manually. Punctured batteries can ignite "
            "or leach toxic heavy metals (lead, cadmium, mercury) into soil and water."
        ),
        "municipal_note": (
            "E-waste requires specialized recovery centers to neutralize heavy metals and recover "
            "precious elements. Consult your city portal for authorized collection drives."
        )
    },
    {
        "id": "hazardous-waste",
        "title": "Hazardous Household Waste",
        "badge": "Toxic & Regulated",
        "color": "danger",
        "icon": "bi-exclamation-triangle",
        "definition": (
            "Substances posing substantial hazards to human safety and ecosystems due to flammable, "
            "toxic, corrosive, or chemically reactive characteristics."
        ),
        "examples": [
            "Paints, synthetic varnishes, and enamel thinners",
            "Pesticides, weedicides, and rodent control pellets",
            "Acidic bathroom cleaners, drain unblockers, and ammonia solutions",
            "Motor oil, brake fluids, and lead-acid vehicle batteries"
        ],
        "handling": (
            "Retain products in their original labeled containers whenever feasible. Store in a secure, "
            "ventilated spot away from heat, open flames, children, and domestic pets."
        ),
        "precautions": (
            "Always wear protective gloves and a face covering during handling. NEVER pour hazardous liquids "
            "into sinks, toilets, or street gutters, as they severely poison municipal water bodies."
        ),
        "municipal_note": (
            "Hazardous waste disposal is strictly governed by environmental protection laws. "
            "Surrender only at designated municipal hazardous collection drop-off points."
        )
    },
    {
        "id": "special-waste",
        "title": "Special Waste (Sanitary & Bulky)",
        "badge": "Biomedical & Bulky",
        "color": "secondary",
        "icon": "bi-shield-shaded",
        "definition": (
            "Waste items requiring specialized bio-secure disposal or dedicated oversized transport "
            "due to hygiene considerations or large volume."
        ),
        "examples": [
            "Sanitary napkins, baby diapers, and incontinence products",
            "Used medical bandages, antiseptic cotton swabs, and surgical masks",
            "Discarded mattresses, large broken furniture, and bed frames",
            "Renovation rubble, broken tiles, and construction debris"
        ],
        "handling": (
            "Wrap sanitary hygiene items securely in newspaper or biodegradable bags, marked with a "
            "distinct red dot for sanitation worker safety. Contact local civic helplines to schedule "
            "dedicated pickup for bulky furniture."
        ),
        "precautions": (
            "NEVER flush diapers or sanitary napkins down toilets; they do not dissolve and cause "
            "catastrophic sewer clogs. Protect sanitation workers from direct exposure to biological waste."
        ),
        "municipal_note": (
            "Sanitary waste is treated in high-temperature municipal incinerators. Bulky items require "
            "scheduled municipal on-demand transport."
        )
    }
]

ENVIRONMENTAL_TIPS = [
    {
        "id": 1,
        "area": "Reducing Single-Use Plastic",
        "category_slug": "plastic",
        "icon": "bi-bag-check",
        "tip": "Carry a durable cloth or canvas tote bag whenever you step out to avoid plastic bags."
    },
    {
        "id": 2,
        "area": "Reducing Single-Use Plastic",
        "category_slug": "plastic",
        "icon": "bi-cup-straw",
        "tip": "Bring your own stainless steel water bottle and skip buying single-use bottled water."
    },
    {
        "id": 3,
        "area": "Reducing Single-Use Plastic",
        "category_slug": "plastic",
        "icon": "bi-slash-circle",
        "tip": "Decline single-use plastic cutlery and straws; carry reusable portable utensils in your bag."
    },
    {
        "id": 4,
        "area": "Saving Water",
        "category_slug": "water",
        "icon": "bi-droplet-half",
        "tip": "Turn off running taps while brushing your teeth or washing hands to save up to 6 liters per minute."
    },
    {
        "id": 5,
        "area": "Saving Water",
        "category_slug": "water",
        "icon": "bi-wrench",
        "tip": "Report and immediately repair leaky faucets and flush valves across college hostels and campus labs."
    },
    {
        "id": 6,
        "area": "Saving Water",
        "category_slug": "water",
        "icon": "bi-flower1",
        "tip": "Reuse water drained from rinsing rice, pulses, and vegetables to nourish potted garden plants."
    },
    {
        "id": 7,
        "area": "Conserving Electricity",
        "category_slug": "energy",
        "icon": "bi-lightbulb-off",
        "tip": "Switch off lights, fans, computer displays, and projectors whenever stepping out of classrooms."
    },
    {
        "id": 8,
        "area": "Conserving Electricity",
        "category_slug": "energy",
        "icon": "bi-plug",
        "tip": "Unplug chargers and idle electronic adapters; phantom standby power can consume 10% of household electricity."
    },
    {
        "id": 9,
        "area": "Conserving Electricity",
        "category_slug": "energy",
        "icon": "bi-sun",
        "tip": "Utilize natural window daylight in study spaces during daytime hours rather than artificial illumination."
    },
    {
        "id": 10,
        "area": "Recycling and Reusing Materials",
        "category_slug": "reuse",
        "icon": "bi-file-earmark-text",
        "tip": "Use blank reverse sides of printed handouts and assignments for rough calculations and brainstorming notes."
    },
    {
        "id": 11,
        "area": "Recycling and Reusing Materials",
        "category_slug": "reuse",
        "icon": "bi-box-seam",
        "tip": "Wash and repurpose glass containers and plastic jars to organize stationery, cables, and dry groceries."
    },
    {
        "id": 12,
        "area": "Recycling and Reusing Materials",
        "category_slug": "reuse",
        "icon": "bi-book",
        "tip": "Donate completed course textbooks, lab notebooks, and unused stationery to juniors or library donation boxes."
    },
    {
        "id": 13,
        "area": "Keeping Public Places Clean",
        "category_slug": "cleanliness",
        "icon": "bi-trash3",
        "tip": "Never litter in public streets or campus pathways; keep trash in your pocket until you spot an appropriate bin."
    },
    {
        "id": 14,
        "area": "Keeping Public Places Clean",
        "category_slug": "cleanliness",
        "icon": "bi-people",
        "tip": "Join or coordinate monthly cleanliness and plogging drives in campus grounds and neighborhood parks."
    },
    {
        "id": 15,
        "area": "Keeping Public Places Clean",
        "category_slug": "cleanliness",
        "icon": "bi-signpost-split",
        "tip": "Practice waste segregation at source by depositing waste into distinct wet and dry bins at public food courts."
    },
    {
        "id": 16,
        "area": "Composting Suitable Organic Waste",
        "category_slug": "composting",
        "icon": "bi-tree",
        "tip": "Set up a terracotta pot composter for fruit and vegetable peels to produce natural nutrient-rich plant fertilizer."
    },
    {
        "id": 17,
        "area": "Composting Suitable Organic Waste",
        "category_slug": "composting",
        "icon": "bi-layers",
        "tip": "Balance wet green kitchen waste with dry browns (dry leaves, shredded unprinted cardboard) to ensure odorless composting."
    },
    {
        "id": 18,
        "area": "Responsible E-Waste Disposal",
        "category_slug": "ewaste",
        "icon": "bi-phone",
        "tip": "Dispose of depleted batteries, chargers, and dead gadgets at authorized e-waste bins rather than household trash."
    },
    {
        "id": 19,
        "area": "Responsible E-Waste Disposal",
        "category_slug": "ewaste",
        "icon": "bi-tools",
        "tip": "Repair cracked screens or battery issues before deciding to replace electronic devices with new models."
    }
]

ISSUE_TYPES = [
    "Littering",
    "Overflowing Dustbin",
    "Improper Waste Segregation",
    "Plastic Pollution",
    "Drainage / Stagnant Water Issue",
    "Other Environmental Issue"
]


# -----------------------------------------------------------------------------
# CSV Business Logic & Storage Helpers
# -----------------------------------------------------------------------------

def ensure_csv_file(file_path: str = DEFAULT_CSV_FILE) -> bool:
    """
    Ensures that the reports CSV file exists. If absent, creates it with standard headers.
    Returns True if newly created, False if it already existed.
    """
    path = pathlib.Path(file_path)
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)
        return True
    return False


def get_next_report_id(file_path: str = DEFAULT_CSV_FILE) -> str:
    """
    Inspects existing records to find the maximum existing report number
    and generates the next incremental collision-free ID (e.g., ENV-0001, ENV-0002).
    """
    ensure_csv_file(file_path)
    max_id_number = 0

    try:
        with open(file_path, mode="r", newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            _ = next(reader, None)  # Skip header row
            for row in reader:
                if row and len(row) > 0:
                    raw_id = row[0].strip()
                    if raw_id.startswith("ENV-"):
                        num_part = raw_id.replace("ENV-", "")
                        if num_part.isdigit():
                            num_val = int(num_part)
                            if num_val > max_id_number:
                                max_id_number = num_val
    except Exception:
        pass

    return f"ENV-{max_id_number + 1:04d}"


def validate_report_data(location: str, issue_type: str) -> Tuple[bool, str]:
    """
    Validates form inputs:
    - Location must be non-empty and at least 2 characters.
    - Issue type must belong to the approved ISSUE_TYPES list.
    """
    if not location or not location.strip():
        return False, "Location is required. Please specify a campus area or street landmark."

    cleaned_loc = location.strip()
    if len(cleaned_loc) < 2:
        return False, "Location name must contain at least 2 characters."

    if not issue_type or issue_type.strip() not in ISSUE_TYPES:
        return False, "Please select a valid issue type from the dropdown."

    return True, cleaned_loc


def save_report(
    location: str,
    issue_type: str,
    description: str = "",
    file_path: str = DEFAULT_CSV_FILE,
    timestamp: Optional[str] = None
) -> Tuple[bool, str, str]:
    """
    Validates and persists a community report to the CSV file.
    Returns: (success: bool, report_id: str, error_or_success_message: str)
    """
    is_valid, validated_loc_or_err = validate_report_data(location, issue_type)
    if not is_valid:
        return False, "", validated_loc_or_err

    ensure_csv_file(file_path)
    report_id = get_next_report_id(file_path)

    if timestamp is None:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cleaned_desc = description.strip() if description else ""

    row_data = [report_id, timestamp, validated_loc_or_err, issue_type.strip(), cleaned_desc]

    try:
        with open(file_path, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(row_data)
        return True, report_id, "Report successfully recorded."
    except Exception as err:
        return False, "", f"Failed to save report: {err}"


def get_all_reports(file_path: str = DEFAULT_CSV_FILE) -> Tuple[List[Dict[str, str]], int]:
    """
    Reads all reports from the CSV file.
    Returns: (list_of_report_dicts, count_of_malformed_records)
    Safe against missing files and corrupted lines.
    """
    path = pathlib.Path(file_path)
    if not path.exists():
        return [], 0

    reports: List[Dict[str, str]] = []
    malformed_count = 0

    try:
        with open(path, mode="r", newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None)
            if header is None:
                return [], 0

            for row in reader:
                if not row or all(field.strip() == "" for field in row):
                    continue

                if len(row) < 5:
                    malformed_count += 1
                    continue

                desc_val = row[4].strip()
                reports.append({
                    "id": row[0].strip(),
                    "timestamp": row[1].strip(),
                    "location": row[2].strip(),
                    "issue_type": row[3].strip(),
                    "description": desc_val if desc_val else "No description provided"
                })
    except Exception:
        return [], 0

    # Sort reports newest first based on timestamp or ID
    reports.reverse()
    return reports, malformed_count


# -----------------------------------------------------------------------------
# Flask Controller Routes
# -----------------------------------------------------------------------------

@app.route("/")
def index():
    """Home / Landing page with overview statistics and quick links."""
    reports, _ = get_all_reports(DEFAULT_CSV_FILE)
    stats = {
        "total_reports": len(reports),
        "total_categories": len(WASTE_CATEGORIES),
        "total_tips": len(ENVIRONMENTAL_TIPS),
        "recent_reports": reports[:3]  # Show 3 latest reports on home page
    }
    return render_template("index.html", stats=stats)


@app.route("/segregation")
def segregation_guide():
    """Feature 1: Interactive Waste Segregation Guide."""
    return render_template("segregation.html", categories=WASTE_CATEGORIES)


@app.route("/tips")
def environmental_tips():
    """Feature 2: Environmental Tips Hub with interactive filtering."""
    category_filters = [
        {"slug": "all", "name": "All Tips"},
        {"slug": "plastic", "name": "Plastic Reduction"},
        {"slug": "water", "name": "Water Conservation"},
        {"slug": "energy", "name": "Energy Conservation"},
        {"slug": "reuse", "name": "Recycling & Reuse"},
        {"slug": "cleanliness", "name": "Clean Public Spaces"},
        {"slug": "composting", "name": "Organic Composting"},
        {"slug": "ewaste", "name": "E-Waste Disposal"}
    ]
    return render_template(
        "tips.html",
        tips=ENVIRONMENTAL_TIPS,
        categories=category_filters
    )


@app.route("/report", methods=["GET", "POST"])
def report_issue():
    """Feature 3: Community Cleanliness Issue Reporting form."""
    if request.method == "POST":
        location = request.form.get("location", "")
        issue_type = request.form.get("issue_type", "")
        description = request.form.get("description", "")

        success, report_id, message = save_report(
            location=location,
            issue_type=issue_type,
            description=description,
            file_path=DEFAULT_CSV_FILE
        )

        if success:
            flash(
                {
                    "title": "Report Submitted Successfully!",
                    "report_id": report_id,
                    "location": location.strip(),
                    "issue_type": issue_type.strip(),
                    "text": (
                        f"Your issue has been recorded with ID {report_id} and saved locally. "
                        "Note: This is an academic community prototype; reports are stored locally "
                        "and are not dispatched automatically to municipal authorities."
                    )
                },
                "success"
            )
            return redirect(url_for("view_reports"))
        else:
            flash(message, "danger")
            # Preserve user input on validation error
            return render_template(
                "report_issue.html",
                issue_types=ISSUE_TYPES,
                form_data={"location": location, "issue_type": issue_type, "description": description}
            )

    return render_template("report_issue.html", issue_types=ISSUE_TYPES, form_data={})


@app.route("/reports")
def view_reports():
    """Feature 4: Saved Reports Dashboard with search & filter."""
    query = request.args.get("q", "").strip().lower()
    issue_filter = request.args.get("type", "").strip()

    all_reports, malformed_count = get_all_reports(DEFAULT_CSV_FILE)

    filtered = []
    for r in all_reports:
        matches_query = (
            query == ""
            or query in r["location"].lower()
            or query in r["id"].lower()
            or query in r["description"].lower()
        )
        matches_type = (issue_filter == "" or r["issue_type"] == issue_filter)

        if matches_query and matches_type:
            filtered.append(r)

    return render_template(
        "view_reports.html",
        reports=filtered,
        total_count=len(all_reports),
        malformed_count=malformed_count,
        search_query=request.args.get("q", ""),
        selected_type=issue_filter,
        issue_types=ISSUE_TYPES
    )


@app.route("/api/reports")
def api_reports():
    """Lightweight REST endpoint returning reports as JSON for examination or AJAX."""
    reports, malformed = get_all_reports(DEFAULT_CSV_FILE)
    return jsonify({
        "status": "success",
        "count": len(reports),
        "malformed_count": malformed,
        "reports": reports
    })


# -----------------------------------------------------------------------------
# Application Runner
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    ensure_csv_file(DEFAULT_CSV_FILE)
    # Debug mode is enabled for development and educational demonstration
    print("\n* Starting Community Cleanliness & Waste Awareness Web App...")
    print("* Local Server running at: http://127.0.0.1:5000\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
