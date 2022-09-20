const MapToDbName = (input: string) => {

    switch (input) {
        case "One On One":
            return "One_On_One";
        case "OneOnOne":
            return "One_On_One";
        case "Online (beginners)":
            return "Online_Beginners";
        case "OnlineBeginners":
            return "Online_Beginners";
        case "Online (intermediate)":
            return "Online_Intermediate";
        case "Private Online":
            return "Private_Online";
        default:
            return "";

    }

}

export default MapToDbName