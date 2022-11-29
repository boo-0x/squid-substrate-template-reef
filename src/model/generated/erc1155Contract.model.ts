import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {ERC1155Token} from "./erc1155Token.model"

@Entity_()
export class ERC1155Contract {
    constructor(props?: Partial<ERC1155Contract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => ERC1155Token, e => e.contract)
    mintedTokens!: ERC1155Token[]
}
