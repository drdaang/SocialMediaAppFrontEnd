import styles from "./styles.module.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../DataProvider";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Lottie from "lottie-react";
import animationData from "./spinner2.json";
import ParticlesComponent from "./particles";

const API_BASE_URL = "https://socialmediaappbackend-5sib.onrender.com";

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mail } = useContext(DataContext);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  const [images, setImages] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(0);

  const [formVisible, setFormVisible] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchImages(activePage);
    }
  }, []);

  const fetchImages = async (page) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/`, {
        params: { page, size: LIMIT },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedImages = res.data.formattedImages;
      setTotal(res.data.total);

      setImages((prevImages) => {
        const newImages = fetchedImages.filter(
          (newImage) => !prevImages.some((existingImage) => existingImage._id === newImage._id)
        );
        return [...prevImages, ...newImages];
      });

      setHasMore(images.length + fetchedImages.length < res.data.total);
    } catch (err) {
      console.log("Error fetching images", err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchMoreImages = () => {
    setTimeout(() => {
      setActivePage((prevPage) => prevPage + 1);
    }, 3000); // 3 seconds delay before loading next set of images
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      name: `${location.state.fname} ${location.state.lname}`,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFormData({
        ...formData,
        name: `${location.state.fname} ${location.state.lname}`,
        image: file,
      });
    } else {
      alert("Only JPEG and PNG files are allowed");
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", `${location.state.fname} ${location.state.lname}`);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("profilePic", formData.image);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/upload`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      const newImage = res.data.newImage;

      setImages((prevImages) => {
        if (!prevImages.some((image) => image._id === newImage._id)) {
          return [newImage, ...prevImages];
        }
        return prevImages;
      });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
  };

  return (
    <div className={styles.mainContainer}>
      <ParticlesComponent id="particles" />
      <nav className={styles.navbar}>
        <div className={styles.navbarButtons}>
          <button className={styles.toggleFormBtn} onClick={toggleFormVisibility}>
            {formVisible ? "Close" : "Post"}
          </button>
        </div>
        <h1>
          {location.state.fname} {location.state.lname}
        </h1>
        <div className={styles.navbarButtons}>
          <button className={styles.toggleFormBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {formVisible && (
        <form className={styles.uploadForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              className={styles.desc}
              name="description"
              onChange={handleChange}
              value={formData.description}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Upload Image</label>
            <input
              type="file"
              name="profilePic"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileChange}
              required
            />
          </div>
          <button className={styles.toggleFormBtn} type="submit">
            Create Post
          </button>
        </form>
      )}

      <InfiniteScroll
        className={styles.imagesContainer}
        dataLength={images.length}
        next={fetchMoreImages}
        hasMore={hasMore}
        loader={<Lottie animationData={animationData} className={styles.spinner} />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {images.map((image, index) => (
          <div key={index} className={styles.imageItem}>
            <h4 className={styles.imageName}>{image.name}</h4>
            <img src={image.image} alt={image.name} className={styles.image} />
            <h5 className={styles.imageDescription}>{image.description}</h5>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Main;
