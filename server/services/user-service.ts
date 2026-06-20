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
}

export default UserService;
