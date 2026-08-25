export const Meal = ({
  meal,
  mealName,
  mealPrice,
  selected,
  onSelect,
}) => {
  const getMealType = () => {
    const text = `
      ${meal?.SSR_TypeName || ""}
      ${meal?.SSR_TypeDesc || ""}
      ${meal?.SSR_Name || ""}
      ${meal?.Meal_Name || ""}
      ${meal?.MealName || ""}
      ${meal?.Description || ""}
      ${meal?.SSR_Code || ""}
    `.toLowerCase();

    if (
      text.includes("non veg") ||
      text.includes("non-veg") ||
      text.includes("nonveg")
    ) {
      return "nonveg";
    }

    return "veg";
  };

  const getMealImage = () => {
    const code = meal?.SSR_Code?.toUpperCase() || "";

    const text = `
      ${mealName || ""}
      ${meal?.SSR_TypeName || ""}
      ${meal?.SSR_TypeDesc || ""}
      ${meal?.SSR_Name || ""}
      ${meal?.Meal_Name || ""}
      ${meal?.MealName || ""}
      ${meal?.Description || ""}
      ${code}
    `.toLowerCase();

    /*
    * ============================================================
    * 1. EXACT SSR CODE IMAGES
    * ============================================================
    *
    * These are optional.
    * Add important/special meals here when you have their images.
    */

    const exactImages = {
      FRCK: "./../images/fruit-cake.png",
      VBIR: "./../images/veg-biryani.png",
      PTSW: "./../images/paneer-sandwich.png",
      CJSW: "./../images/chicken-junglee-sandwich.png",
      CPML: "./../images/corporate-meal.png",
    };

    if (exactImages[code]) {
      return exactImages[code];
    }

    /*
    * ============================================================
    * 2. KEYWORD BASED IMAGE
    * ============================================================
    */

    // Cake
    if (
      text.includes("cake") ||
      text.includes("dessert") ||
      text.includes("pastry")
    ) {
      return "./../images/dessert-cake.png";
    }

    // Biryani
    if (
      text.includes("biryani") ||
      text.includes("biriyani")
    ) {
      return "./../images/biryani.png";
    }

    // Paneer sandwich
    if (
      text.includes("paneer") &&
      text.includes("sandwich")
    ) {
      return "./../images/paneer-sandwich.png";
    }

    // Chicken sandwich
    if (
      text.includes("chicken") &&
      text.includes("sandwich")
    ) {
      return "./../images/chicken-sandwich.png";
    }

    // Any sandwich
    if (
      text.includes("sandwich") ||
      text.includes("burger") ||
      text.includes("wrap")
    ) {
      return "./../images/sandwich.png";
    }

    // Jain
    if (
      text.includes("jain")
    ) {
      return "./../images/jain-meal.png";
    }

    // Diabetic
    if (
      text.includes("diabetic") ||
      text.includes("diabetes")
    ) {
      return "./../images/diabetic-meal.png";
    }

    // Non-veg / Chicken / Meat
    if (
      text.includes("non-veg") ||
      text.includes("non veg") ||
      text.includes("nonveg") ||
      text.includes("chicken") ||
      text.includes("mutton") ||
      text.includes("fish") ||
      text.includes("egg")
    ) {
      return "./../images/nonveg-meal.png";
    }

    // Veg
    if (
      text.includes("veg") ||
      text.includes("vegetarian")
    ) {
      return "./../images/veg-meal.png";
    }

    // Corporate
    if (
      text.includes("corporate")
    ) {
      return "./../images/corporate-meal.png";
    }

    /*
    * ============================================================
    * 3. DEFAULT
    * ============================================================
    */

    return "./../images/default-meal.png";
  };

  const mealType = getMealType();

  return (
    <div
      className={`duinweuirhwer rounded-2 border p-3 d-flex gap-3 ${
        selected ? "border-primary" : ""
      }`}
      style={{
        cursor: "pointer",
      }}
      onClick={() => onSelect(meal)}
    >
      {/* ============================================================
          IMAGE
      ============================================================ */}
      <div
        className="idnieuhrewr position-relative rounded-1 overflow-hidden"
        style={{
          width: "110px",
          minWidth: "110px",
          height: "100px",
        }}
      >
        <img
          src={getMealImage()}
          alt={mealName || "Meal"}
          className="img-fluid w-100 object-fit-cover h-100"
          onError={(e) => {
            e.currentTarget.src = "./../images/default-meal.png";
          }}
        />
        <img
          src={
            mealType === "nonveg"
              ? "/images/nonveg.png"
              : "/images/veg.png"
          }
          style={{
            width: "1rem",
          }}
          className="img-fluid bg-white m-1 position-absolute bottom-0 start-0"
          alt=""
        />
      </div>
      {/* ============================================================
          CONTENT
      ============================================================ */}
      <div className="diheifsdf flex-grow-1"> 
        <p
          className="mb-2"
          style={{
            fontWeight: 600,
          }}
        >
          {mealName || "Meal"}
        </p>

        <div className="oidmejwijrwer d-flex align-items-center justify-content-between">
          <h6 className="mb-0">
            <b>
              {meal?.Currency_Code || "INR"} {mealPrice || 0}
            </b>
          </h6>

          <button
            type="button"
            className={`rounded-1 py-1 px-3 btn ${
              selected
                ? "bg-primary text-white"
                : "bg-white border-primary text-primary"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(meal);
            }}
          >
            {selected ? "ADDED" : "ADD"}
          </button>
        </div>
      </div>
    </div>
  );
};