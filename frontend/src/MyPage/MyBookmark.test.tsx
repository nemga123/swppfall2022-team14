import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { CocktailInfo, CocktailItemType } from "../store/slices/cocktail/cocktail";
import { CommentInfo } from "../store/slices/comment/comment";
import { IngredientInfo } from "../store/slices/ingredient/ingredient";
import { getMockStore } from "../test-utils/mock";
import MyBookmark from "./MyBookmark";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

jest.mock("../common/Components/Item", () => (prop:Pick<CocktailItemType, "image" | "name" | "rate" | "type" | "id" | "tags">) => (
    <div data-testid={`spyComment_${prop.id}`}>
    </div>
));

const standard_cocktail1_item: CocktailItemType = {
    id: 1,
    name: "ST_COCKTAIL1",
    image: "IMAGE1",
    type: "ST",
    tags: [],
    author_id: null,
    rate: 0
}

const cocktaiState: CocktailInfo = {
    cocktailList: [ standard_cocktail1_item ],
    cocktailItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const emptyCommentState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
}

const emptyingredientState: IngredientInfo = {
    ingredientList: [],
    ingredientItem: null,
    itemStatus: "success",
    listStatus: "success",
}

const mockStore = getMockStore({cocktail: cocktaiState, ingredient: emptyingredientState, comment: emptyCommentState});

describe("<MyBookMark />", () => {
    it("should render items without errors", () => {
        render(    
            <Provider store={mockStore}>
                <MyBookmark/>
            </Provider>
        ); 
        const items = screen.getAllByTestId("spyComment_1");
        expect(items).toHaveLength(1);
        expect(mockDispatch).toBeCalledTimes(1)
    });
});