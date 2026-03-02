import CountryService from "../services/country.service.ts";

class CountryController {
  private countryService: CountryService;

  constructor() {
    this.countryService = new CountryService();
  }

  public getCountries = async (req, res) => {
    const countries = await this.countryService.getAllCountries(req, res);

    return countries;
  };
}

export default CountryController;
