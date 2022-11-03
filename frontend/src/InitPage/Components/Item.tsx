import { useNavigate } from "react-router"
import { CocktailType } from "../../store/slices/cocktail/cocktail"
import styles from './Item.module.scss'
import React from "react"

const Item = (prop: Pick<CocktailType, "image" | "name" | "rate" | "type" | "id">) => {

    const navigate = useNavigate()


    const onClickItem = () => {
        if (prop.type === 'CS') navigate(`/custom/${prop.id}`)
        else if (prop.type === 'ST') navigate(`/standard/${prop.id}`)
    }

    return <div className={styles.item} onClick={onClickItem}>
        <img className={styles.item__image} src={prop.image} />
        <div className={styles.item__name}>{prop.name}</div>
        <div className={styles.item__rate}>{prop.rate} / 5점</div>

    </div>
}


export default Item