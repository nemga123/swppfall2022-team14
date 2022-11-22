import { MemoryRouter, Route, Routes } from "react-router";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/mock";
import { CocktailInfo } from "../../store/slices/cocktail/cocktail";
import { CommentInfo } from "../../store/slices/comment/comment";
import { IngredientInfo } from "../../store/slices/ingredient/ingredient";
import Filter from "./Filter";
import {UserInfo} from "../../store/slices/user/user";
import React from 'react'

const stubCocktailInitialState: CocktailInfo = {
    cocktailList: [],
    cocktailItem: null,
    itemStatus: "loading",
    listStatus: "loading",
}

const stubCommentInitialState: CommentInfo = {
    commentList: [],
    commentItem: null,
    state: null,
};

const stubIngredientInitialState: IngredientInfo = {
    ingredientList: [],
    ingredientItem: null,
    itemStatus: "loading",
    listStatus: "loading",
};

const stubUserInitialState: UserInfo = {
    user: {
        id: (localStorage.getItem("id") === null) ? null : localStorage.getItem("id"),
        username:  (localStorage.getItem("username") === null) ? null : localStorage.getItem("username"),
        password:  null,
        nickname:  (localStorage.getItem("nickname") === null) ? null : localStorage.getItem("nickname"),
        intro:  (localStorage.getItem("intro") === null) ? null : localStorage.getItem("intro"),
        profile_img:  (localStorage.getItem("profile_img") === null) ? null : localStorage.getItem("profile_img"),
    },
    token: (localStorage.getItem("token") === null) ? null : localStorage.getItem("token"),
    isLogin: (localStorage.getItem("token") !== null)
}

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const renderFilter = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Filter setUrlParams={ jest.fn() }/>} />
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                cocktail: stubCocktailInitialState,
                comment: stubCommentInitialState,
                ingredient: stubIngredientInitialState,
                user: stubUserInitialState
            },
        }
    );
};

describe("<Filter />", () => {
    it("should render Filter", async () => {
        renderFilter();
        await screen.findByText("Type 1");
    });
    it("should be unique when unique type clicked", async () => {
        renderFilter();
        const typeButton = screen.getByLabelText("15도 이하");
        fireEvent.click(typeButton);
        fireEvent.click(typeButton);
    });
    it("should be non-unique when non-unique type clicked", async () => {
        renderFilter();
        const typeButton1 = screen.getByLabelText("클래식");
        fireEvent.click(typeButton1);
        fireEvent.click(typeButton1);
        const typeButton2 = screen.getByLabelText("롱드링크");
        fireEvent.click(typeButton2);
        fireEvent.click(typeButton2);
    });
});