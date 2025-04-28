import axios from "axios";
import TimeAgo from "./TimeAgo";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import config from "../config";

const PostsList = ({
  post,
  user,
  onUpdatePost,
  onDeletePost,
  reFetchPost,
  setReFetchPost,
  setReFetchSharedPost,
  reFetchSharedPost,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareDescription, setShareDescription] = useState("");

  const navigate = useNavigate();

  const handleLike = async (postId) => {
    try {
      console.log('Attempting to like post:', {
        postId,
        userId: user.id,
        apiUrl: `${config.apiBaseUrl}/posts/like?postId=${postId}&userId=${user.id}`
      });

      const response = await axios.post(
        `${config.apiBaseUrl}/posts/like?postId=${postId}&userId=${user.id}`
      );

      console.log('Server response:', response);

      if (response.status === 200) {
        const updatedPost = response.data;
        console.log('Updated post data:', updatedPost);
        
        // Update the post state
        onUpdatePost({
          ...post,
          likedBy: updatedPost.likedBy || [],
          likeCount: updatedPost.likeCount || 0
        });
        
        // Refresh the posts list
        setReFetchPost(!reFetchPost);
        toast.success('Post liked successfully');
      } else {
        console.error('Unexpected response status:', response.status);
        toast.error('Failed to like post');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 404) {
        toast.error('Post not found');
      } else if (error.response?.status === 500) {
        toast.error('Server error occurred');
      } else {
        toast.error(error.response?.data?.message || 'Failed to like post');
      }
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/comments`,
        {
          postId,
          userId: user.id,
          content: commentText
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onUpdatePost({
          ...post,
          comments: [...post.comments, response.data.data]
        });
      } else {
        toast.error(response.data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleShare = async (postId) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/share-posts`,
        {
          postId,
          userId: user.id
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Post shared successfully');
        setReFetchSharedPost(!reFetchSharedPost);
      } else {
        toast.error(response.data.message || 'Failed to share post');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error(error.response?.data?.message || 'Failed to share post');
    }
  };

  const navigateEditPage = () => {
    navigate(`/post/${post.id}`);
  };

  const deletePost = async (post) => {
    try {
      await axios.delete(`http://localhost:8080/posts/${post.id}`);
      setReFetchPost(!reFetchPost);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const commentAdd = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error("Comment is required");

    if (editComment) {
      try {
        await axios.put(
          `http://localhost:8080/posts/${post.id}/comments/${commentId}`,
          {
            content: comment,
          }
        );
        setComment("");
        setCommentId(null);
        setEditComment(false);
        setReFetchPost(!reFetchPost);
        toast.success("Comment updated successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8080/posts/${post.id}/comments`,
          {
            commentBy: user.name,
            commentById: user.id,
            commentByProfile: user.profileImage,
            content: comment,
          }
        );
        if (res.data) {
          setComment("");
          setReFetchPost(!reFetchPost);
          toast.success("Comment added successfully");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteComment = async (comment) => {
    try {
      await axios.delete(
        `http://localhost:8080/posts/${post.id}/comments/${comment.id}`
      );
      toast.success("Comment deleted successfully");
      setReFetchPost(!reFetchPost);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = (comment, postId) => {
    setComment(comment.content);
    setEditComment(true);
  };

  return (
    <div>
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="border max-w-screen-md bg-white mt-6 rounded-2xl p-4">
          <div className="flex items-center	justify-between">
            <div className="gap-3.5	flex items-center ">
              <img
                src={post?.userProfile}
                alt=""
                className="object-cover bg-yellow-500 rounded-full w-10 h-10"
              />
              <div className="flex flex-col">
                <b className="mb-2 capitalize">{post?.username}</b>
                <time datetime="06-08-21" className="text-gray-400 text-xs">
                  <TimeAgo date={post?.date} />
                </time>
              </div>
            </div>
            <div className="bg-gray-100	rounded-full h-3.5 flex	items-center justify-center gap-3">
              {user?.id === post?.userId && (
                <>
                  <AiFillDelete
                    size={20}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => deletePost(post)}
                  />
                  <AiFillEdit
                    size={20}
                    color="blue"
                    className="cursor-pointer"
                    onClick={navigateEditPage}
                  />
                </>
              )}
            </div>
          </div>
          <div className="whitespace-pre-wrap mt-7 font-bold ">
            {post?.title}
          </div>
          <p className="mt-1 text-sm text-gray-700">{post?.description}</p>
          <div className="mt-5 flex gap-2	 justify-center border-b pb-4 flex-wrap	w-[600px] max-w-[700px]">
            {post?.images?.length === 3 ? (
              <>
                <img
                  src={post.images[0]}
                  alt=""
                  className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto"
                />
                <img
                  src={post.images[1]}
                  alt=""
                  className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto"
                />
                <img
                  src={post.images[2]}
                  alt=""
                  className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto"
                />
              </>
            ) : post?.images?.length === 2 ? (
              <>
                <img
                  src={post.images[0]}
                  alt=""
                  className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto"
                />
                <img
                  src={post.images[1]}
                  alt=""
                  className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto"
                />
              </>
            ) : post?.images?.length === 1 ? (
              <img
                src={post.images[0]}
                alt=""
                className="bg-red-500 rounded-2xl w-1/3 object-cover h-96 flex-auto"
              />
            ) : (
              <>
                <video
                  controls
                  className="mt-3"
                  style={{ maxWidth: "570px", height: "auto" }}
                >
                  <source src={post?.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </>
            )}
          </div>
          <div className=" h-16 border-b  flex items-center justify-around	">
            <div className="flex items-center	gap-3	cursor-pointer">
              {post.likedBy?.includes(user.id) ? (
                <FaHeart
                  size={24}
                  color="red"
                  onClick={() => handleLike(post.id)}
                  className="cursor-pointer hover:scale-110 transition-transform"
                />
              ) : (
                <CiHeart
                  size={24}
                  color="red"
                  onClick={() => handleLike(post.id)}
                  className="cursor-pointer hover:scale-110 transition-transform"
                />
              )}
              <p className="text-gray-600">{post.likeCount || 0} Like{post.likeCount !== 1 ? 's' : ''}</p>
            </div>
            <div
              className="flex items-center	gap-3 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <MdOutlineInsertComment size={24} color="blue" />
              <p className="text-blue-900 ">{post?.comments?.length} Comment</p>
            </div>

            <div
              className="flex items-center	gap-3 cursor-pointer"
              onClick={() => setShareModal(true)}
            >
              <FaShareFromSquare size={22} />
              <p> Share</p>
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[550px] h-[600px] px-10 justify-between py-10">
                <div className="text-center font-bold text-xl flex justify-between ">
                  <h1 className="text-blue-800">Comments</h1>
                  <IoClose
                    color="red"
                    size={28}
                    className="cursor-pointer"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className=" h-[400px] overflow-y-scroll ">
                  <div className="flex flex-col gap-8 justify-center">
                    {post.comments?.length > 0 ? (
                      post?.comments?.map((comment) => (
                        <div className="flex items-center  justify-between">
                          <div className="flex gap-5">
                            <div className="flex justify-center items-center">
                              <img
                                src={comment?.commentByProfile}
                                alt=""
                                className="object-cover bg-yellow-500 rounded-full w-14 h-14"
                              />
                            </div>
                            <div className="flex flex-col">
                              <b className="capitalize">{comment?.commentBy}</b>
                              <time
                                datetime="06-08-21"
                                className="text-gray-400 text-xs"
                              >
                                <TimeAgo date={comment?.createdAt} />
                              </time>
                              <p className="mt-1 text-base">
                                {comment?.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-5 px-5">
                            {user?.id === comment?.commentById && (
                              <>
                                <AiFillDelete
                                  onClick={() => deleteComment(comment)}
                                  size={20}
                                  color="red"
                                  className="cursor-pointer"
                                />
                                <AiFillEdit
                                  onClick={() => {
                                    handleEditComment(comment, post.id);
                                    setCommentId(comment.id);
                                  }}
                                  size={20}
                                  color="blue"
                                  className="cursor-pointer"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-2xl text-gray-400">
                        No comments yet
                      </div>
                    )}
                  </div>
                </div>
                <form onSubmit={commentAdd} className="flex">
                  <input
                    type="text"
                    className="px-2 w-full h-10 border"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white w-20 h-10"
                  >
                    {<>{editComment ? "Update" : "Add"} </>}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {shareModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[550px] h-[300px] px-10 justify-between py-10">
                <div className="text-center font-bold text-xl flex justify-between ">
                  <h1 className="text-blue-800">Share</h1>
                  <IoClose
                    color="red"
                    size={28}
                    className="cursor-pointer"
                    onClick={() => setShareModal(false)}
                  />
                </div>
                <form className="flex flex-col" onSubmit={(e) => {
                  e.preventDefault();
                  handleShare(post.id);
                }}>
                  <textarea
                    className="border h-32 p-2"
                    placeholder="Write something"
                    onChange={(e) => setShareDescription(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white mt-4 h-8"
                  >
                    Share
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
export default PostsList;
