import {
    AnyAction,
    configureStore,
    EnhancedStore
} from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import reducer, { CocktailItemType, CocktailDetailType, IngredientPrepareType, CocktailInfo, cocktailActions } from "./cocktail";
import {fetchCustomCocktailList, fetchStandardCocktailList, fetchMyCocktailList} from "./cocktail";
import {getCocktail, postCocktail} from "./cocktail"

describe("userInfo reducer", () => {
    let store: EnhancedStore<
        { cocktail: CocktailInfo },
        AnyAction,
        [ThunkMiddleware<{ cocktail: CocktailInfo }, AnyAction, undefined>]
        >;

    const fakeCocktailItemCS = {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1","CS2"],
        author_id: 1,
        rate: 1,
    }
    const fakeCocktailItemST = {
        id: 1,
        name: "name",
        image: "img",
        type: "ST",
        tags: ["ST1","ST2"],
        author_id: 1,
        rate: 1,
    }
    const fakeIngredients = {
        id: 1,
        name: "iname",
        image: "iimg",
        ABV: 1,
        price: 1,
        introduction: "iintro",
        amount : 1,
    }
    const fakeDetailCS = {
        id: 1,
        name: "name",
        image: "img",
        type: "CS",
        tags: ["CS1","CS2"],
        author_id: 1,
        rate: 1,
        introduction: "intro",
        recipe: "recipe",
        ABV: 1,
        price_per_glass: 1,
        created_at: "2020-10-10",
        updated_at: "2020-10-10",
        ingredients: [{
            id: 1,
            name: "iname",
            image: "iimg",
            ABV: 1,
            price: 1,
            introduction: "iintro",
            amount : 1,
        }]
    }
    const fakeDetailOmit = {
        name: "name",
        image: "img",
        tags: ["ST1","ST2"],
        author_id: 1,
        introduction: "intro",
        recipe: "recipe",
        ABV: 1,
        price_per_glass: 1,
        ingredients: []
    }

    beforeAll(() => {
        store = configureStore({ reducer: { cocktail: reducer } });
    });

    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            cocktailList: [],
            cocktailItem: null,
            itemStatus: "loading",
            listStatus: "loading"
        });
    });

    it("should handle fetchStandardCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {cocktails: [fakeCocktailItemST]} });
        await store.dispatch(fetchStandardCocktailList(""));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemST])
    });
    it("should handle fetchCustomCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {cocktails: [fakeCocktailItemCS]} });
        await store.dispatch(fetchCustomCocktailList(""));
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });
    it("should handle fetchMyCocktailList", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: {cocktails: [fakeCocktailItemCS]} });
        await store.dispatch(fetchMyCocktailList());
        expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });

    it("should handle getCocktail", async () => {
        axios.get = jest.fn().mockResolvedValueOnce({ data: [fakeIngredients] }).mockResolvedValueOnce({ data: fakeDetailCS });
        await store.dispatch(getCocktail(1));
        expect(store.getState().cocktail.itemStatus).toEqual("success")
        expect(store.getState().cocktail.cocktailItem).toEqual(fakeDetailCS)

    });

    it("should handle postCocktail", async () => {
        axios.post = jest.fn().mockResolvedValue({data : fakeCocktailItemST});
        await store.dispatch(postCocktail(fakeDetailOmit));
        //expect(store.getState().cocktail.cocktailList).toEqual([fakeCocktailItemCS])
    });

});