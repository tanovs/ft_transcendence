import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import Achievement from "../users/entities/Achievement";

@Service()
@EntityRepository(Achievement)
export default class AchievementRepository extends Repository<Achievement> {}
