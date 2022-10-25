const MapToDbName = (input: string) => {
    switch (input) {
        case "one-on-one":
            return "One_On_One";
        case "beginners-online":
            return "Beginners_Online";
        case "One On One":
            return "One_On_One";
        case "OneOnOne":
            return "One_On_One";
        case "Beginners (Online)":
            return "Beginners_Online";
        case "BeginnersOnline":
            return "Beginners_Online";
        case "Intermediate (Online)":
            return "Intermediate_Online";
        case "Private Online":
            return "Private_Online";
        case "Course Beginners (Level One)":
            return "Course_Beginners_Level_One"
        default:
            return "";
    }
};

export default MapToDbName;
