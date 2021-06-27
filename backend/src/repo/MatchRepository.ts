import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import Match from "../users/entities/Match";
import User from "../users/entities/User";

@Service()
@EntityRepository(Match)
export default class MatchRepository extends Repository<Match> {
  async findById(id: number): Promise<Match> {
    return await this.findOne(id);
  }

  async findAllByUser(user: User): Promise<Array<Match>> {
    return await this.find({
      where: [{ player1: user }, { player2: user }],
    });
  }
}
