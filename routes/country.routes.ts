import { Router } from "express";
import CountryController from "../controllers/country.controller.ts";

class CountryRoutes {
  public router: Router;
  private countryController: CountryController;

  constructor() {
    this.router = Router();
    this.countryController = new CountryController();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(
      "/list",
      this.countryController.getCountries,
    );
  };
}

export default CountryRoutes;
