import { useNavigate } from "react-router"
import { CocktailDetailType } from "../../store/slices/cocktail/cocktail";
import styles from './IngredientItem.module.scss'
import React from 'react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteMyIngredients } from "../../store/slices/ingredient/ingredient";

// TODO : MODIFY THIS WITH IngredientItemType


const IngredientItem = (prop: Pick<CocktailDetailType, "image" | "name" | "ABV" | "id"> & { my_item: boolean, user_id: number }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const onClickItem = () => {
        navigate(`/ingredient/${prop.id}`)

    }

    const onClickDelete = (e: any) => {
        e.stopPropagation();
        dispatch(deleteMyIngredients({ user_id: prop.user_id, ingredient_id: prop.id }))
    }

    return <div className={styles.item} onClick={onClickItem}>
        {prop.my_item ? <button className={styles.item__delete} onClick={onClickDelete}>X</button> : null}
        <img className={styles.item__image} src={prop.image} />
        <div className={styles.item__name}>{prop.name}</div>
        <div className={styles.item__ABV}>{prop.ABV} 도</div>
    </div >

}

IngredientItem.defaultProps = {
    my_item: false,
    user_id: 4
}




export default IngredientItem