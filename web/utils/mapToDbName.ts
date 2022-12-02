const MapToDbName = (input: string) => {
  switch (input) {
    case "one-on-one":
      return "One_On_One";
    case "beginners-online":
      return "Beginners_Online";
    case "intermediate-online":
      return "Intermediate_Online";
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
    case "Course Beginners Level One (Online)":
      return "Course_Beginners_Level_One";
    case "Course Beginners Level One Seniors (Online)":
      return "Course_Beginners_Level_One_Seniors";
    default:
      return "";
  }
};

export default MapToDbName;
