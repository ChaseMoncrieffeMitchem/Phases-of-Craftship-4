import { PrismaClient } from "@prisma/client";
import { generateRandomPassword } from "../utils";

export interface UsersPersistence {
    save(user: NewUser): any;
    findUserByEmail(email: string): any;
    findUserByUsername(username: string): any;
}

type NewUser = {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

export class Database {
    public users: UsersPersistence;

    constructor(private prisma: PrismaClient) { 
        this.users = this.buildUsersPersistence();
    }

    private buildUsersPersistence(): UsersPersistence {
        return {
            save: this.saveUser.bind(this),
            findUserByEmail: this.findUserByEmail.bind(this),
            findUserByUsername: this.findUserByUsername.bind(this)
        }
    }

    private async saveUser(user: NewUser) {
        const { email, firstName, lastName, username } = user;
        return await this.prisma.$transaction(async () => {
            const user = await this.prisma.user.create({ data: { email, username, firstName, lastName, password: generateRandomPassword(10) } });
            const member = await this.prisma.member.create({ data: { userId: user.id }})
            return { user, member}
        })
    }

    private async findUserByEmail(email: string) {
        return this.prisma.user.findFirst({ where: { email } });
    }

    private async findUserByUsername(username: string) {
        return this.prisma.user.findFirst({ where: { username } });
    }
}