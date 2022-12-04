import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { selectCocktail, getCocktail, toggleBookmark, updateRate } from "../store/slices/cocktail/cocktail";
import Comment from "./Comment/Comment";
import './ItemDetailPage.scss';
import React from 'react';
import { fetchCommentListByCocktailId, postComment, selectComment } from "../store/slices/comment/comment";
import NavBar from "../NavBar/NavBar";
import axios from 'axios';
import LoginModal from "../InitPage/Modals/LoginModal";
import { selectUser } from "../store/slices/user/user";
import { postRate, editRate, deleteRate } from "../store/slices/rate/rate";
import { Box, Button, Checkbox, ImageListItem, Divider, IconButton, Modal, Rating, Stack, Typography } from "@mui/material";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditIcon from '@mui/icons-material/Edit';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default function ItemDetailPage() {
    const { type, id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const cocktailState = useSelector(selectCocktail);
    const commentState = useSelector(selectComment);
    const userState = useSelector(selectUser)
    const navigate = useNavigate()
    const onIngredientClick = (id: number) => {
        navigate(`/ingredient/${id}`)
    }
    const [content, setContent] = useState<string>("")
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)

    const [rateOpen, setRateOpen] = useState(false);
    const handleRateOpen = () => setRateOpen(true);
    const handleRateClose = () => setRateOpen(false);

    const cocktail = cocktailState.cocktailItem;
    const isCustom = cocktail?.type === "CS";

    useEffect(() => {
        dispatch(getCocktail(Number(id)));
        dispatch(fetchCommentListByCocktailId(Number(id)));
    }, []);

    useEffect(() => {
        if (cocktail) {
            setScore(cocktail.score);
        }
    }, [cocktail]);

    const createCommentHandler = () => {
        if (userState.isLogin) {
            const data = {
                content: content,
                parent_comment: null,
                cocktail: Number(id)
            }
            dispatch(postComment(data));
            setContent("")
        }
        else {
            setIsLoginOpen(true)
        }
    }

    const toggleBookmarkHandler = () => {
        if (userState.isLogin && userState.token) {
            dispatch(toggleBookmark({ cocktail_id: Number(id), token: userState.token }));
        }
        else {
            setIsLoginOpen(true)
        }
    }

    const onChangeRate = async (changedScore: number | null) => {
        if(userState.isLogin) {
            if (changedScore) {
                setScore(changedScore);
                const data = { cocktail_id: Number(id), score: changedScore };
                if (score) {  // PUT score
                    await dispatch(editRate(data));
                } else {      // POST score
                    await dispatch(postRate(data));
                }
            } else {
                setScore(0);
                const data = { cocktail_id: Number(id) };
                await dispatch(deleteRate(data));
            }
            dispatch(updateRate(Number(id)));
        } else {
            setIsLoginOpen(true);
        }
    }

    if (cocktailState.itemStatus == "loading") {
        return <div>Loading ..</div>
    }
    else if (cocktailState.itemStatus == "failed" || !cocktail) {
        return <div>Non existing cocktail</div>
    }
    // Type mismatch
    else if (!((isCustom && type === "custom") || (!isCustom && type === "standard"))) {
        return <div>Type mismatch</div>
    }
    else {
        return (
            <Stack direction="row" justifyContent="space-between" divider={<Divider orientation="vertical" flexItem />}>
                <NavBar />
                <Stack alignItems="flex-start" spacing={2} sx={{ width: 1, p: 3 }}>
                    <Typography variant="h2">
                        {cocktail.name}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
                        <Typography sx={{ color: 'primary.light' }} variant="body2">
                            {isCustom && `created by ${cocktail.author_name}`}
                        </Typography>
                        <Stack direction="row" justifyContent="flex-end">
                            {Number(userState.user?.id) === cocktail.author_id &&
                                <IconButton onClick={() => navigate(`/custom/${id}/edit`)}>
                                    <EditIcon />
                                </IconButton>
                            }
                            <Checkbox
                                icon={<BookmarkBorderIcon />}
                                checkedIcon={<BookmarkIcon />}
                                onClick={toggleBookmarkHandler}
                            />
                            <Button variant="contained" onClick={handleRateOpen}
                                sx={{
                                    bgcolor: 'primary.dark', 
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    '&:hover': {
                                        backgroundColor: 'secondary.main',
                                        boxShadow: 2,
                                    },
                                }}
                            >
                                별점주기
                            </Button>
                            <Modal open={rateOpen} onClose={handleRateClose}>
                                <Box 
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 300,
                                        bgcolor: 'background.paper',
                                        border: '2px solid #000',
                                        boxShadow: 24,
                                        p: 4,
                                    }}
                                >
                                    <Stack alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: 1, height: 1}}>
                                        <Typography variant="h4">
                                            {score}
                                        </Typography>
                                        <Rating
                                            value={score}
                                            precision={0.5}
                                            onChange={(event, newValue) => {
                                                onChangeRate(newValue)
                                            }}
                                        />
                                        <Typography variant="body1">
                                            좌우로 드래그하세요
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Modal>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: 1 }}>
                        <ImageListItem sx={{ width: 0.3, height: 'fit-content' }}>
                            <img
                                src={cocktail.image}
                                style={{ borderRadius: 20 }}
                            />
                        </ImageListItem>
                        <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1 }}>
                            <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, p: 2, bgcolor: 'primary.main', borderRadius: 3 }}>
                                <Rating value={cocktail.rate} precision={0.1} readOnly />
                                <Typography variant="body1">
                                    {cocktail.ABV.toFixed(1)}%
                                </Typography>
                                <Typography variant="body1">
                                    {cocktail.price_per_glass.toLocaleString()}원
                                </Typography>
                                <Typography variant="body2" align='left'>
                                    {cocktail.introduction}
                                </Typography>
                            </Stack>
                            <Stack alignItems="flex-start" justifyContent="flex-start" spacing={2} sx={{ width: 1, p: 2 }}>
                                <Stack direction="row" justifyContent="flex-start" spacing={1} sx={{ width: 1 }}>
                                    {cocktail.ingredients?.map((ingre) => { 
                                        return (
                                            <Box 
                                                key={ingre.id} 
                                                sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                                onClick={() => onIngredientClick(ingre.id)}
                                            >
                                                {ingre.name}
                                                &nbsp;
                                                {ingre.amount  && ingre.amount}
                                            </Box>
                                        )
                                    })}
                                </Stack>
                                <Typography variant="body2" align='left'>
                                    {cocktail.recipe}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Divider flexItem />
                    <Stack direction="row" justifyContent="flex-start" spacing={1} sx={{ width: 1 }}>
                        {cocktail.tags.map((tag, idx) => { 
                            return (
                                <Box 
                                    key={`${tag}_${idx}`} 
                                    sx={{ bgcolor: 'primary.light', borderRadius: 5, px: 1, py: 0.2, textAlign: 'center' }}
                                >
                                    #{tag}
                                </Box>
                            )
                        })}
                    </Stack>
                    <Divider flexItem />
                    <div>
                        <div className="comments">
                            <div className="comments__create">
                                <textarea id="comment_text" className="comments__input" value={content} onChange={(e) => setContent(e.target.value)} />
                                <div className="comments__add-box">
                                    <button className="comments__add" onClick={() => createCommentHandler()}>
                                        Add
                                    </button>
                                </div>
                            </div>
                            <div className="comments_list">
                                {commentState.commentList.map((comment) => {
                                    if (!comment.parent_comment) {
                                        return (
                                            <Comment
                                                key={`${comment.id}_comment`}
                                                id={comment.id}
                                                author_id={comment.author_id}
                                                content={comment.content}
                                                created_at={comment.created_at}
                                                updated_at={comment.updated_at}
                                                parent_comment={null}
                                                is_deleted={comment.is_deleted}
                                                cocktail={comment.cocktail}
                                            />
                                        )
                                    }
                                    else {
                                        return null
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </Stack>
                <LoginModal isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
            </Stack>
        )
    }
}