import { Service, Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Match from "../users/entities/Match";
import User from "../users/entities/User";
import MatchRepository from "../repo/MatchRepository";

@Service()
export default class MatchService {
  constructor(
    @InjectRepository()
    private readonly repository: MatchRepository
  ) {}

  async findById(id: number): Promise<Match> {
    return await this.repository.findById(id)
  }

  async findAllByUser(user: User): Promise<Array<Match>> {
    return await this.repository.findAllByUser(user);
  }

  async save(match: Match): Promise<Match> {
    return this.repository.save(match);
  }
}
