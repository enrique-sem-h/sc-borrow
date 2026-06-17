import { usuarios } from "../../infra/database/schemas/usuariosSchema";
import { db } from "../../infra/database/index";
import { eq } from "drizzle-orm";

class UserRepository {
  static async findByCpf(cpf: string) {
    const user = await db.select().from(usuarios).where(eq(usuarios.cpf, cpf));
    return user[0];
  }

  static async findByEmail(email: string) {
    const user = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email));
    return user[0];
  }

  static async create(body: any) {
    const [resultId] = await db.insert(usuarios).values(body).$returningId();

    const newUser = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, resultId.id));

    return newUser[0];
  }

  static async read(id: string) {
    const user = await db.query.usuarios.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
    });

    return user;
  }
}

export default UserRepository;
