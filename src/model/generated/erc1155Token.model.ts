import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {ERC1155Owner} from "./erc1155Owner.model"
import {ERC1155Transfer} from "./erc1155Transfer.model"
import {ERC1155Contract} from "./erc1155Contract.model"

@Entity_()
export class ERC1155Token {
    constructor(props?: Partial<ERC1155Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => ERC1155Owner, {nullable: true})
    owner!: ERC1155Owner | undefined | null

    @Column_("text", {nullable: true})
    uri!: string | undefined | null

    @OneToMany_(() => ERC1155Transfer, e => e.token)
    transfers!: ERC1155Transfer[]

    @Index_()
    @ManyToOne_(() => ERC1155Contract, {nullable: true})
    contract!: ERC1155Contract | undefined | null
}
