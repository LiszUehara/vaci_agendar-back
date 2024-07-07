import crypto from "crypto";
import { scheduleModel } from "../models/schedule.model";

class ScheduleController {
  constructor() {
  }

  async index(request, response) {
    try {
      return response.status(200).send("Listagem");
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async store(request, response) {
    try {
      return response.status(201).send("Cadastro");
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }

  async update(request, response) {
    try {
      return response.send("Atualização");
    } catch (error) {
      return response.status(400).json({ error });
    }
  }


  async getOne(request, response) {
    try {
      response.status(200).send("Listagem por id");
    } catch (error) {
      response.status(400).send(error);
    }
  }
}

export default ScheduleController;