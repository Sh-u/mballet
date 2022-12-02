const mapToBrowserName = (name: string) => {
  switch (name) {
    case "one-on-one":
      return "One On One";
    case "beginners-online":
      return "Beginners (Online)";
    case "intermediate-online":
      return "Intermediate (Online)";
  }
};

export default mapToBrowserName;
