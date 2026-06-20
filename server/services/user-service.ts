import HistoricoPagamentoRepository from "../repositories/historico-pagamento-repository";
import UserRepository from "../repositories/user-repository";

class UserService {
  public async getCarteira(userId: string) {
    return await HistoricoPagamentoRepository.getByUser(userId);
  }

  public async getSaldo(userId: string) {
    const user = await UserRepository.read(userId);
    const saldo = user!.saldo;
    return saldo;
  }

  public async getRep(userId: string) {
    const user = await UserRepository.read(userId);
    const rep = user!.rep;
    console.log("Rep", rep);

    return rep;
  }

  public async resgatarSaldo(userId: string) {
    await UserRepository.resgatarSaldo(userId);
  }
}

export default UserService;
