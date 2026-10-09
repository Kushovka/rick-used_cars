"""Correct mileage for the current vehicle listings.

Revision ID: 20261005_0012
Revises: 20260927_0011
Create Date: 2026-10-05
"""

from copy import deepcopy

from alembic import op
import sqlalchemy as sa


revision = "20261005_0012"
down_revision = "20260927_0011"
branch_labels = None
depends_on = None


def _update_mileage(
    vehicle_id: str,
    expected_mileage: int,
    new_mileage: int,
    expected_short_description: str,
    new_short_description: str,
    expected_description: str | None = None,
    new_description: str | None = None,
) -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("id", sa.String),
        sa.column("mileage", sa.Integer),
        sa.column("short_description", sa.String),
        sa.column("description", sa.Text),
        sa.column("details", sa.JSON),
    )
    connection = op.get_bind()
    row = connection.execute(
        sa.select(
            vehicles.c.mileage,
            vehicles.c.short_description,
            vehicles.c.description,
            vehicles.c.details,
        ).where(vehicles.c.id == vehicle_id)
    ).mappings().one_or_none()

    if row is None:
        raise RuntimeError(f"Vehicle {vehicle_id} was not found")
    if row["mileage"] != expected_mileage:
        raise RuntimeError(
            f"Expected {expected_mileage} miles for {vehicle_id}, found {row['mileage']}"
        )
    if row["short_description"] != expected_short_description:
        raise RuntimeError(f"Unexpected short description for {vehicle_id}; refusing to overwrite it")
    if expected_description is not None and row["description"] != expected_description:
        raise RuntimeError(f"Unexpected description for {vehicle_id}; refusing to overwrite it")

    details = deepcopy(row["details"] or {})
    info = details.get("info")
    mileage_items = [
        item for item in info or []
        if str(item.get("label", "")).strip().lower() == "mileage"
    ]
    if len(mileage_items) != 1 or mileage_items[0].get("value") != f"{expected_mileage:,} miles":
        raise RuntimeError(f"Unexpected Mileage detail for {vehicle_id}; refusing to overwrite it")

    mileage_items[0]["value"] = f"{new_mileage:,} miles"
    updated_fields = {
        "mileage": new_mileage,
        "short_description": new_short_description,
        "details": details,
    }
    if expected_description is not None:
        updated_fields["description"] = new_description
    connection.execute(vehicles.update().where(vehicles.c.id == vehicle_id).values(**updated_fields))


def upgrade() -> None:
    _update_mileage(
        "2025-toyota-land-cruiser-j250",
        12000,
        12587,
        "2025 Toyota Land Cruiser J250 with 12,000 miles.",
        "2025 Toyota Land Cruiser J250 with 12,587 miles.",
    )
    _update_mileage(
        "2024-chevrolet-corvette-z06-convertible-3lz",
        367,
        982,
        "2024 Chevrolet Corvette Z06 Convertible 3LZ with 367 miles.",
        "2024 Chevrolet Corvette Z06 Convertible 3LZ with 982 miles.",
        "367-mile Z06 Convertible 3LZ in Red Mist with the LT6 V8, front lift, power hardtop, and GT2 seats.",
        "982-mile Z06 Convertible 3LZ in Red Mist with the LT6 V8, front lift, power hardtop, and GT2 seats.",
    )
    _update_mileage(
        "2024-ram-1500-trx-final-edition",
        6000,
        5345,
        "2024 Ram 1500 TRX Crew Cab 4×4 Final Edition with 6,000 miles.",
        "2024 Ram 1500 TRX Crew Cab 4×4 Final Edition with 5,345 miles.",
    )
    _update_mileage(
        "2024-chevrolet-corvette-stingray-3lt-z51",
        8000,
        2864,
        "2024 Chevrolet Corvette Stingray Coupe 3LT Z51 with 8,000 miles.",
        "2024 Chevrolet Corvette Stingray Coupe 3LT Z51 with 2,864 miles.",
        "8k-mile Corvette Stingray 3LT Z51 with a front lift system, magnetic ride, and selected performance upgrades.",
        "2,864-mile Corvette Stingray 3LT Z51 with a front lift system, magnetic ride, and selected performance upgrades.",
    )
    _update_mileage(
        "2019-mercedes-amg-g63", 61000, 51894,
        "2019 Mercedes-AMG G63 with 61,000 miles.",
        "2019 Mercedes-AMG G63 with 51,894 miles.",
    )
    _update_mileage(
        "2020-audi-s8", 60000, 84253,
        "2020 Audi S8 with 60,000 miles.",
        "2020 Audi S8 with 84,253 miles.",
    )
    _update_mileage(
        "2021-ford-f-150-raptor-supercrew", 39000, 36585,
        "2021 Ford F-150 Raptor SuperCrew with 39,000 miles.",
        "2021 Ford F-150 Raptor SuperCrew with 36,585 miles.",
    )
    _update_mileage(
        "2020-chevrolet-corvette-stingray-2lt", 13000, 5996,
        "2020 Chevrolet Corvette Stingray Coupe 2LT with 13,000 miles.",
        "2020 Chevrolet Corvette Stingray Coupe 2LT with 5,996 miles.",
        "Elkhart Lake Blue Corvette Stingray 2LT with front-axle lift, performance exhaust, heads-up display, and 13k miles.",
        "Elkhart Lake Blue Corvette Stingray 2LT with front-axle lift, performance exhaust, heads-up display, and 5,996 miles.",
    )
    _update_mileage(
        "2021-porsche-cayenne-turbo", 65000, 55341,
        "2021 Porsche Cayenne Turbo with 65,000 miles.",
        "2021 Porsche Cayenne Turbo with 55,341 miles.",
    )
    _update_mileage(
        "2021-toyota-land-cruiser-urj200-22k", 22000, 35223,
        "2021 Toyota Land Cruiser URJ200 with 22,000 miles.",
        "2021 Toyota Land Cruiser URJ200 with 35,223 miles.",
        "22k-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, three-row seating, and a clean Carfax.",
        "35,223-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, three-row seating, and a clean Carfax.",
    )
    _update_mileage(
        "2024-gmc-sierra-2500hd-denali-ultimate", 26000, 28713,
        "2024 GMC Sierra 2500HD Denali Ultimate Crew Cab Duramax 4×4 with 26,000 miles.",
        "2024 GMC Sierra 2500HD Denali Ultimate Crew Cab Duramax 4×4 with 28,713 miles.",
    )
    _update_mileage(
        "2023-cadillac-escalade-v", 25000, 30784,
        "2023 Cadillac Escalade-V with 25,000 miles.",
        "2023 Cadillac Escalade-V with 30,784 miles.",
    )
    _update_mileage(
        "2023-chevrolet-silverado-1500-rst-black-widow", 24000, 21342,
        "2023 Chevrolet Silverado 1500 Crew Cab RST Z71 4×4 Black Widow with 24,000 miles.",
        "2023 Chevrolet Silverado 1500 Crew Cab RST Z71 4×4 Black Widow with 21,342 miles.",
    )
    _update_mileage(
        "2022-gmc-sierra-1500-limited-harley-davidson", 29000, 28794,
        "2022 GMC Sierra 1500 Limited SLT Crew Cab Official Harley-Davidson with 29,000 miles.",
        "2022 GMC Sierra 1500 Limited SLT Crew Cab Official Harley-Davidson with 28,794 miles.",
    )
    _update_mileage(
        "2021-toyota-land-cruiser-urj200-23k", 23000, 28102,
        "2021 Toyota Land Cruiser URJ200 with 23,000 miles.",
        "2021 Toyota Land Cruiser URJ200 with 28,102 miles.",
        "23k-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, KDSS, and a clean Carfax.",
        "28,102-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, KDSS, and a clean Carfax.",
    )


def downgrade() -> None:
    _update_mileage(
        "2025-toyota-land-cruiser-j250",
        12587,
        12000,
        "2025 Toyota Land Cruiser J250 with 12,587 miles.",
        "2025 Toyota Land Cruiser J250 with 12,000 miles.",
    )
    _update_mileage(
        "2024-chevrolet-corvette-z06-convertible-3lz",
        982,
        367,
        "2024 Chevrolet Corvette Z06 Convertible 3LZ with 982 miles.",
        "2024 Chevrolet Corvette Z06 Convertible 3LZ with 367 miles.",
        "982-mile Z06 Convertible 3LZ in Red Mist with the LT6 V8, front lift, power hardtop, and GT2 seats.",
        "367-mile Z06 Convertible 3LZ in Red Mist with the LT6 V8, front lift, power hardtop, and GT2 seats.",
    )
    _update_mileage(
        "2024-ram-1500-trx-final-edition",
        5345,
        6000,
        "2024 Ram 1500 TRX Crew Cab 4×4 Final Edition with 5,345 miles.",
        "2024 Ram 1500 TRX Crew Cab 4×4 Final Edition with 6,000 miles.",
    )
    _update_mileage(
        "2024-chevrolet-corvette-stingray-3lt-z51",
        2864,
        8000,
        "2024 Chevrolet Corvette Stingray Coupe 3LT Z51 with 2,864 miles.",
        "2024 Chevrolet Corvette Stingray Coupe 3LT Z51 with 8,000 miles.",
        "2,864-mile Corvette Stingray 3LT Z51 with a front lift system, magnetic ride, and selected performance upgrades.",
        "8k-mile Corvette Stingray 3LT Z51 with a front lift system, magnetic ride, and selected performance upgrades.",
    )
    _update_mileage("2019-mercedes-amg-g63", 51894, 61000, "2019 Mercedes-AMG G63 with 51,894 miles.", "2019 Mercedes-AMG G63 with 61,000 miles.")
    _update_mileage("2020-audi-s8", 84253, 60000, "2020 Audi S8 with 84,253 miles.", "2020 Audi S8 with 60,000 miles.")
    _update_mileage("2021-ford-f-150-raptor-supercrew", 36585, 39000, "2021 Ford F-150 Raptor SuperCrew with 36,585 miles.", "2021 Ford F-150 Raptor SuperCrew with 39,000 miles.")
    _update_mileage(
        "2020-chevrolet-corvette-stingray-2lt", 5996, 13000,
        "2020 Chevrolet Corvette Stingray Coupe 2LT with 5,996 miles.",
        "2020 Chevrolet Corvette Stingray Coupe 2LT with 13,000 miles.",
        "Elkhart Lake Blue Corvette Stingray 2LT with front-axle lift, performance exhaust, heads-up display, and 5,996 miles.",
        "Elkhart Lake Blue Corvette Stingray 2LT with front-axle lift, performance exhaust, heads-up display, and 13k miles.",
    )
    _update_mileage("2021-porsche-cayenne-turbo", 55341, 65000, "2021 Porsche Cayenne Turbo with 55,341 miles.", "2021 Porsche Cayenne Turbo with 65,000 miles.")
    _update_mileage(
        "2021-toyota-land-cruiser-urj200-22k", 35223, 22000,
        "2021 Toyota Land Cruiser URJ200 with 35,223 miles.",
        "2021 Toyota Land Cruiser URJ200 with 22,000 miles.",
        "35,223-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, three-row seating, and a clean Carfax.",
        "22k-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, three-row seating, and a clean Carfax.",
    )
    _update_mileage("2024-gmc-sierra-2500hd-denali-ultimate", 28713, 26000, "2024 GMC Sierra 2500HD Denali Ultimate Crew Cab Duramax 4×4 with 28,713 miles.", "2024 GMC Sierra 2500HD Denali Ultimate Crew Cab Duramax 4×4 with 26,000 miles.")
    _update_mileage("2023-cadillac-escalade-v", 30784, 25000, "2023 Cadillac Escalade-V with 30,784 miles.", "2023 Cadillac Escalade-V with 25,000 miles.")
    _update_mileage("2023-chevrolet-silverado-1500-rst-black-widow", 21342, 24000, "2023 Chevrolet Silverado 1500 Crew Cab RST Z71 4×4 Black Widow with 21,342 miles.", "2023 Chevrolet Silverado 1500 Crew Cab RST Z71 4×4 Black Widow with 24,000 miles.")
    _update_mileage("2022-gmc-sierra-1500-limited-harley-davidson", 28794, 29000, "2022 GMC Sierra 1500 Limited SLT Crew Cab Official Harley-Davidson with 28,794 miles.", "2022 GMC Sierra 1500 Limited SLT Crew Cab Official Harley-Davidson with 29,000 miles.")
    _update_mileage(
        "2021-toyota-land-cruiser-urj200-23k", 28102, 23000,
        "2021 Toyota Land Cruiser URJ200 with 28,102 miles.",
        "2021 Toyota Land Cruiser URJ200 with 23,000 miles.",
        "28,102-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, KDSS, and a clean Carfax.",
        "23k-mile Land Cruiser URJ200 finished in Midnight Black with Terra leather, KDSS, and a clean Carfax.",
    )
