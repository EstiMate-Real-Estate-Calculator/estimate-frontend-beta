import React from 'react';
import { Rate, Avatar } from 'antd';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const reviews = [
    {
        id: 1,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Kristin Watson",
        date: "Jun 27, 2025",
        rating: 4,
    },
    {
        id: 2,
        text: "Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        name: "Kristin Watson",
        date: "Jun 27, 2025",
        rating: 3,
    },
    {
        id: 3,
        text: "The tools are very helpful and support is excellent. Would recommend to all investors.",
        image: "https://randomuser.me/api/portraits/men/51.jpg",
        name: "John Doe",
        date: "Apr 5, 2025",
        rating: 5,
    },
];

const ReviewSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="reviewWrapper">
            <div className='reviewData'>
            <h2 className="title">What our Members Say</h2>
            <Slider {...settings}>
                {reviews.map((review) => (
                    <div key={review.id} className="card">
                        <p className="text">{review.text}</p>
                        <div className="footer">
                            <div className="user">
                                <Avatar src={review.image} size={40} />
                                <div>
                                    <div className="name">{review.name}</div>
                                    <div className="date">{review.date}</div>
                                </div>
                            </div>
                            <Rate disabled defaultValue={review.rating} />
                        </div>
                    </div>
                ))}
            </Slider>
            </div>
            <div className='comingSoon'>Coming Soon</div>
        </div>
    );
};

export default ReviewSlider;
