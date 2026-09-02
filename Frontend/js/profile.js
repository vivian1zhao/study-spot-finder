const API_BASE = "http://localhost:5001";


document.addEventListener("DOMContentLoaded", () => {
    const darkToggle =
        document.getElementById("dark-toggle");

    if (darkToggle) {
        darkToggle.addEventListener(
            "click",
            () => {
                document.body.classList.toggle(
                    "dark"
                );
            }
        );
    }


    const closeModalButton =
        document.getElementById(
            "close-modal"
        );

    if (closeModalButton) {
        closeModalButton.addEventListener(
            "click",
            closeEditModal
        );
    }


    const cancelEditButton =
        document.getElementById(
            "cancel-edit"
        );

    if (cancelEditButton) {
        cancelEditButton.addEventListener(
            "click",
            closeEditModal
        );
    }


    const editForm =
        document.getElementById(
            "edit-review-form"
        );

    if (editForm) {
        editForm.addEventListener(
            "submit",
            saveReviewChanges
        );
    }

    const logoutButton =
        document.getElementById("logout-btn");

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            logout
        );
    }

    loadProfile();
});


function getLoggedInUserId() {
    return localStorage.getItem(
        "user_id"
    );
}


/* =========================
   PROFILE
   ========================= */

async function loadProfile() {
    const userId = getLoggedInUserId();

    if (!userId) {
        showError("Log in to view your profile.");
        return;
    }

    loadProfileAvatar(userId);
    const loading = document.getElementById("loading");

    if (loading) {
        loading.style.display = "block";
    }

    try {
        await Promise.all([
            loadUserInfo(userId),
            loadFavorites(userId),
            loadReviews(userId)
        ]);

        if (loading) {
            loading.style.display = "none";
        }

    } catch (error) {
        console.error(error);

        showError("Could not load your profile. Try again later.");
    }
}

function loadProfileAvatar(userId) {
    const profileAvatar =
        document.getElementById("profile-avatar");

    if (!profileAvatar) {
        return;
    }


    const initials =
        localStorage.getItem("userInitials");

    if (initials) {
        profileAvatar.textContent = initials;
    }

    const colorKey = `avatarColor_${userId}`;
    const avatarColor =
        localStorage.getItem(colorKey) ||
        localStorage.getItem(
            "avatarColor"
        );

    if (avatarColor) {
        profileAvatar.style.backgroundColor = avatarColor;
    }
}

async function loadUserInfo(userId) {
    const response = await fetch(
        `${API_BASE}/users/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load user information");
    }

    const user = await response.json();

    const profileName =
        document.getElementById("profile-name");

    const profileUsername =
        document.getElementById("profile-username");

    const profileEmail =
        document.getElementById("profile-email");

    const profileLocation =
        document.getElementById("profile-location");

    if (profileName) {
        profileName.textContent = `${user.fname} ${user.lname}`;
    }

    if (profileUsername) {
        profileUsername.textContent = `@${user.username}`;
    }

    if (profileEmail) {
        profileEmail.textContent = user.email || "";
    }

    if (profileLocation) {
        if (user.city && user.state) {
            profileLocation.textContent = `${user.city}, ${user.state}`;

        } else if (user.city) {
            profileLocation.textContent = user.city;

        } else if (user.state) {
            profileLocation.textContent = user.state;

        } else {
            profileLocation.textContent = "";
        }
    }

    const initials =
        user.fname.charAt(0).toUpperCase() +
        user.lname.charAt(0).toUpperCase();

    const profileAvatar =
        document.getElementById(
            "profile-avatar"
        );

    if (profileAvatar) {
        profileAvatar.textContent =
            initials;
    }
}


function showError(message) {
    const loading =
        document.getElementById("loading");

    if (loading) {
        loading.style.display =
            "none";
    }


    const errorMessage =
        document.getElementById(
            "error-message"
        );

    if (!errorMessage) {
        return;
    }

    errorMessage.textContent =
        message;

    errorMessage.hidden =
        false;
}


/* =========================
   FAVORITES
   ========================= */

async function loadFavorites(userId) {
    const response = await fetch(
        `${API_BASE}/users/${userId}/favorites`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load favorites"
        );
    }


    const favorites =
        await response.json();


    const container =
        document.getElementById(
            "profile-favorites"
        );

    const emptyMessage =
        document.getElementById(
            "no-favorites"
        );


    if (!container) {
        return;
    }


    container.replaceChildren();


    if (!Array.isArray(favorites)) {
        throw new Error(
            "Invalid favorites data"
        );
    }


    if (favorites.length === 0) {
        if (emptyMessage) {
            emptyMessage.hidden =
                false;
        }

        return;
    }


    if (emptyMessage) {
        emptyMessage.hidden =
            true;
    }


    favorites.forEach((place) => {
        container.appendChild(
            createFavoriteCard(place)
        );
    });
}


function createFavoriteCard(place) {
    const card =
        document.createElement("div");

    card.className =
        "profile-favorite-card";


    const name =
        document.createElement("h3");

    name.textContent =
        place.place_name;


    const city =
        document.createElement("p");

    city.textContent =
        `📍 ${place.city}, ${place.state}`;


    const type =
        document.createElement("p");

    type.textContent =
        place.place_type;


    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "details-btn";

    button.textContent =
        "View Details →";


    button.addEventListener(
        "click",
        () => {
            window.location.href =
                `place_details.html?id=${place.place_id}`;
        }
    );


    card.append(
        name,
        city,
        type,
        button
    );


    return card;
}


/* =========================
   REVIEWS
   ========================= */

async function loadReviews(userId) {
    const response = await fetch(
        `${API_BASE}/users/${userId}/reviews`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load reviews"
        );
    }


    const reviews =
        await response.json();


    const container =
        document.getElementById(
            "profile-reviews"
        );

    const emptyMessage =
        document.getElementById(
            "no-reviews"
        );


    if (!container) {
        return;
    }


    container.replaceChildren();


    if (!Array.isArray(reviews)) {
        throw new Error(
            "Invalid reviews data"
        );
    }


    if (reviews.length === 0) {
        if (emptyMessage) {
            emptyMessage.hidden =
                false;
        }

        return;
    }


    if (emptyMessage) {
        emptyMessage.hidden =
            true;
    }


    reviews.forEach((review) => {
        container.appendChild(
            createReviewCard(review)
        );
    });
}


function createReviewCard(review) {
    const card =
        document.createElement("div");

    card.className =
        "profile-review-card";


    const header =
        document.createElement("div");

    header.className =
        "review-header";


    const info =
        document.createElement("div");


    const placeName =
        document.createElement("h3");

    placeName.textContent =
        review.place_name;


    const rating =
        document.createElement("div");

    rating.className =
        "review-rating";


    const ratingNumber =
        Number(
            review.overall_rating
        );


    const numberSpan =
        document.createElement("span");

    numberSpan.className =
        "rating-number";

    numberSpan.textContent =
        ratingNumber.toFixed(1);


    const stars =
        document.createElement("span");

    stars.className =
        "profile-stars";

    stars.innerHTML =
        getStarRating(
            ratingNumber
        );


    rating.append(
        numberSpan,
        stars
    );


    info.append(
        placeName,
        rating
    );


    const viewButton =
        document.createElement("button");

    viewButton.type =
        "button";

    viewButton.className =
        "details-btn";

    viewButton.textContent =
        "View Place";


    viewButton.addEventListener(
        "click",
        () => {
            window.location.href =
                `place_details.html?id=${review.place_id}`;
        }
    );


    header.append(
        info,
        viewButton
    );


    const comment =
        document.createElement("p");

    comment.className =
        "review-comment";

    comment.textContent =
        review.comments ||
        "No comment provided.";


    const actions =
        document.createElement("div");

    actions.className =
        "review-actions";


    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "profile-action-btn edit-btn";

    editButton.textContent =
        "Edit Review";


    editButton.addEventListener(
        "click",
        () => {
            openEditModal(
                review
            );
        }
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "profile-action-btn delete-btn";

    deleteButton.textContent =
        "Delete Review";


    deleteButton.addEventListener(
        "click",
        () => {
            deleteReview(
                review
            );
        }
    );


    actions.append(
        editButton,
        deleteButton
    );


    card.append(
        header,
        comment,
        actions
    );


    return card;
}


/* =========================
   STARS
   ========================= */

function getStarRating(rating) {
    let stars = "";

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += `
                <span class="star full">
                    ★
                </span>
            `;

        } else if (rating >= i - 0.5) {
            stars += `
                <span class="star half">
                    <span class="empty-star">
                        ★
                    </span>

                    <span class="half-star">
                        ★
                    </span>
                </span>
            `;

        } else {
            stars += `
                <span class="star empty">
                    ★
                </span>
            `;
        }
    }

    return stars;
}


/* =========================
   EDIT REVIEW
   ========================= */

function openEditModal(review) {
    document
        .getElementById(
            "edit-review-id"
        )
        .value =
            review.review_id;


    document
        .getElementById(
            "edit-place-name"
        )
        .textContent =
            review.place_name;


    setInputValue(
        "edit-overall",
        review.overall_rating
    );

    setInputValue(
        "edit-noise",
        review.noise
    );

    setInputValue(
        "edit-seating",
        review.seating
    );

    setInputValue(
        "edit-outlets",
        review.outlets
    );

    setInputValue(
        "edit-wifi",
        review.wifi
    );

    setInputValue(
        "edit-food",
        review.food
    );

    setInputValue(
        "edit-hours",
        review.opening_hours
    );

    setInputValue(
        "edit-parking",
        review.parking
    );


    document
        .getElementById(
            "edit-comments"
        )
        .value =
            review.comments || "";


    document
        .getElementById(
            "edit-modal"
        )
        .hidden = false;
}

function closeEditModal() {
    const modal =
        document.getElementById(
            "edit-modal"
        );

    if (modal) {
        modal.hidden = true;
    }
}

function setInputValue(id, value) {
    document
        .getElementById(id)
        .value =
            value === null ||
            value === undefined
                ? ""
                : value;
}

function getNumberOrNull(id) {
    const value =
        document
            .getElementById(id)
            .value;

    if (value === "") {
        return null;
    }

    return Number(value);
}

async function saveReviewChanges(event) {
    event.preventDefault();

    const userId = getLoggedInUserId();

    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    const reviewId =
        document
            .getElementById("edit-review-id").value;

    const updatedReview = {
        overall_rating:
            getNumberOrNull("edit-overall"),

        noise:
            getNumberOrNull("edit-noise"),

        seating:
            getNumberOrNull("edit-seating"),

        outlets:
            getNumberOrNull("edit-outlets"),

        wifi:
            getNumberOrNull("edit-wifi"),

        food:
            getNumberOrNull("edit-food"),

        opening_hours:
            getNumberOrNull("edit-hours"),

        parking:
            getNumberOrNull("edit-parking"),

        comments:
            document
                .getElementById("edit-comments")
                .value
                .trim()
    };

    try {
        const response = await fetch(
            `${API_BASE}/users/${userId}/reviews/${reviewId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(updatedReview)
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to update review"
            );
        }
        closeEditModal();

        await loadReviews(
            userId
        );

    } catch (error) {
        console.error(error);
        alert("Unable to update your review. Try again later.");
    }
}


/* =========================
   DELETE REVIEW
   ========================= */

async function deleteReview(review) {
    const userId =
        getLoggedInUserId();


    if (!userId) {
        alert("You must be logged in.");
        return;
    }

    const confirmed =
        window.confirm(`Delete your review for "${review.place_name}"?`);

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE}/users/${userId}/reviews/${review.review_id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete review");
        }

        await loadReviews(userId);

    } catch (error) {
        console.error(error);
        alert("Unable to delete your review. Try again later.");
    }
}


function logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("userInitials");
    localStorage.removeItem("avatarColor");

    window.location.href =
        "login.html";
}