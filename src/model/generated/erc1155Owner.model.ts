import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {ERC1155Token} from "./erc1155Token.model"

@Entity_()
export class ERC1155Owner {
    constructor(props?: Partial<ERC1155Owner>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => ERC1155Token, e => e.owner)
    ownedTokens!: ERC1155Token[]

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    balance!: bigint | undefined | null
}
