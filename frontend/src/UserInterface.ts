export interface IStats {
  victories: number,
  losses: number,
  ladderLevel: number,
  wonTournaments: number
}

export default interface IUser {
  id: number,
  username: string,
  isAdmin: boolean,
  profileImage: string,
  stats: IStats,
  isAuth: boolean,
  usesTwoFactAuth: boolean
  watching?: boolean
}
