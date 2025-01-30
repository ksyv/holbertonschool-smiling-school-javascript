$(document).ready(function () {
    const apiUrl = 'https://smileschool-api.hbtn.info/courses';
    let searchValue = "";
    let topicValue = "All";
    let sortValue = "Most Popular";
  
        // Fonction pour peupler les menus déroulants (corrigée)
        function populateDropdowns(data) {
            const topicDropdown = $('#dropdownMenuLinkTopic .dropdown-menu');
            const sortDropdown = $('#dropdownMenuLinkSort .dropdown-menu');
            topicDropdown.empty();
            sortDropdown.empty();
    
            topicDropdown.append(`<a class="dropdown-item ${topicValue === "All" ? "active" : ""}" href="#">All</a>`);
            data.topics.forEach(topic => {
                topicDropdown.append(`<a class="dropdown-item ${topic === topicValue ? "active" : ""}" href="#">${topic}</a>`);
            });
    
            data.sorts.forEach(sort => {
                sortDropdown.append(`<a class="dropdown-item ${sort === sortValue ? "active" : ""}" href="#">${sort}</a>`);
            });
        }
    
        // Fonction pour récupérer et afficher les cours (corrigée et avec logique de filtrage)
        function fetchAndDisplayCourses() {
            $.ajax({
                url: apiUrl,
                type: 'GET',
                data: {
                    q: searchValue,
                    topic: topicValue === "All" ? "" : topicValue,
                    sort: sortValue
                },
                beforeSend: function () {
                    $('#courses-container').empty();
                    $(".loader").show();
                },
                success: function (response) {
                    $('.video-count').text(response.courses.length + " vidéos");
                    $('.search-text-area').val(searchValue);
                    populateDropdowns(response);
    
                    // Logique de filtrage (ajoutée)
                    const filteredCourses = response.courses.filter(course => {
                        const topicMatch = topicValue === "All" || course.topic === topicValue;
                        return topicMatch; // Vous pouvez ajouter d'autres conditions de filtrage ici (sort)
                    });
    
                    displayCourses(filteredCourses); // Affiche les cours filtrés
                },
                error: function () {
                    console.error("Erreur lors de la récupération des cours.");
                },
                complete: function () {
                    $(".loader").hide();
                }
            });
        }
    function generateCardHTML(item) { // Une seule fonction generateCardHTML
        return `
            <div class="carousel-card col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
                <div class="card">
                    <img src="${item.thumb_url || item.thumbnail}" class="card-img-top" alt="Video thumbnail">
                    <div class="card-img-overlay text-center">
                        <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${item.title}</h5>
                        <p class="card-text text-muted">${item["sub-title"] || item.description || ""}</p>
                        <div class="creator d-flex align-items-center">
                            <img src="${item.author_pic_url || 'images/profile_1.jpg'}" alt="${item.author || item.creator}" width="30px" class="rounded-circle">
                            <h6 class="pl-3 m-0 main-color">${item.author || item.creator}</h6>
                        </div>
                        <div class="info pt-3 d-flex justify-content-between">
                            <div class="rating">
                                ${generateStars(item.star || item.rating)}
                            </div>
                            <span class="main-color">${item.duration}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    // Fonction pour peupler les menus déroulants
    function populateDropdowns(data) {
        const topicDropdown = $('#dropdownMenuLinkTopic .dropdown-menu');
        const sortDropdown = $('#dropdownMenuLinkSort .dropdown-menu');
        topicDropdown.empty();
        sortDropdown.empty();

        topicDropdown.append(`<a class="dropdown-item ${topicValue === "All" ? "active" : ""}" href="#">Tous</a>`); // Classe active directement
        data.topics.forEach(topic => {
            topicDropdown.append(`<a class="dropdown-item ${topic === topicValue ? "active" : ""}" href="#">${topic}</a>`); // Classe active directement
        });

        data.sorts.forEach(sort => {
            sortDropdown.append(`<a class="dropdown-item ${sort === sortValue ? "active" : ""}" href="#">${sort}</a>`); // Classe active directement
        });
    }

    function displayCourses(courses) { // Argument renommé pour plus de clarté
        if (!courses || !Array.isArray(courses)) {
            console.error("Données invalides reçues pour les cours.");
            return;
        }

        $(".video-count").text(`${courses.length} vidéos`);

        const cardsHTML = courses.map(generateCardHTML).join("");
        $("#courses-container").html(cardsHTML);
    }

    function generateStars(starCount) {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            stars += `<img src="images/star_${i < starCount ? 'on' : 'off'}.png" alt="star" width="15px">`; // Source d'image simplifiée
        }
        return stars;
    }
  
    // Function for quotes carousel (from previous example)
    function fetchQuotes() {
      $.ajax({
        url: "https://smileschool-api.hbtn.info/quotes",
        dataType: "json",
        beforeSend: function () {
          $(".loader").show();
        },
        success: function (data) {
          updateCarouselQuotes(data);
        },
        error: function () {
          console.error("Erreur de chargement.");
        },
        complete: function () {
          $(".loader").hide();
        }
      });
    }
  
    function updateCarouselQuotes(quotes) {
      const carouselInner = $('#carouselExampleControls .carousel-inner');
      carouselInner.empty();
  
      quotes.forEach((quote, index) => {
        let carouselItem = $('<div class="carousel-item"></div>');
        if (index === 0) {
          carouselItem.addClass('active');
        }
  
        let quoteContent = `
              <div class="row mx-auto align-items-center">
              <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                  <img src="${quote.pic_url}" class="d-block align-self-center" alt="Image du carrousel">
              </div>
              <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                  <div class="quote-text">
                  <p class="text-white">${quote.text}</p>
                  <h4 class="text-white font-weight-bold">${quote.name}</h4>
                  <span class="text-white">${quote.title}</span>
                  </div>
              </div>
              </div>
          `;
  
        carouselItem.html(quoteContent);
        carouselInner.append(carouselItem);
      });
  
      $('#carouselExampleControls').carousel();
    }
  
  
    // Function for popular tutorials carousel (from previous example)
    function fetchPopularTutorials() {
      $.ajax({
        url: "https://smileschool-api.hbtn.info/popular-tutorials",
        dataType: "json",
        success: function (data) {
          displayCustomCarousel(data, "#popular-carousel-track", "#popular-prev-button", "#popular-next-button");
          $(".loader").hide();
        },
        error: function () {
          console.error("Erreur lors de la récupération des tutoriels populaires.");
        }
      });
    }
  
    function displayCustomCarousel(data, containerId, prevButtonId, nextButtonId) {
      // Validate data.
      if (!data || !Array.isArray(data)) {
        console.error("Données invalides reçues pour le carrousel.");
        return;
      }
  
      const $carouselTrack = $(containerId);
      let currentIndex = 0;
  
      // Display the cards.
      const cardsHTML = data.map(generateCardHTML).join("");
      $carouselTrack.html(cardsHTML);
  
      // Add event listeners to navigation buttons.
      $(prevButtonId).on("click", () => moveCarousel(-1));
      $(nextButtonId).on("click", () => moveCarousel(1));
  
      function moveCarousel(direction) {
        const cardWidth = $(".carousel-card").outerWidth(true);
        const visibleCards = Math.floor($(".carousel-track-container").width() / cardWidth);
        const totalCards = data.length;
  
        // Update current index based on direction.
        currentIndex += direction;
  
        // Infinite loop
        if (currentIndex < 0) {
          currentIndex = totalCards - visibleCards; // Go to the end
        } else if (currentIndex > totalCards - visibleCards) {
          currentIndex = 0; // Go back to the beginning
        }
  
        // Apply the transition
        $carouselTrack.css("transition", "transform 0.5s ease-in-out");
        $carouselTrack.css("transform", `translateX(-${currentIndex * cardWidth}px)`);
      }
  
      // Generate the cards.
      
    }
  
  
    // Function for latest videos carousel (from previous example)
    function fetchLatestVideos() {
      $.ajax({
        url: "https://smileschool-api.hbtn.info/latest-videos",
        dataType: "json",
        success: function (data) {
          displayCustomCarousel(data, "#latest-videos-carousel-track", "#latest-videos-prev-button", "#latest-videos-next-button");
          $(".loader").hide();
        },
        error: function () {
          console.error("Erreur lors de la récupération des dernières vidéos.");
        }
      });
    }
  
 // Écouteurs d'événements (corrigés)
 $('.search-text-area').on('input', function () {
    searchValue = $(this).val();
    fetchAndDisplayCourses();
});

$('#dropdownMenuLinkTopic').parent().on('click', '.dropdown-item', function (event) {
    event.preventDefault();
    topicValue = $(this).text();
    $('#dropdownMenuLinkTopic span').text(topicValue);
    fetchAndDisplayCourses();
});

$('#dropdownMenuLinkSort').parent().on('click', '.dropdown-item', function (event) {
    event.preventDefault();
    sortValue = $(this).text();
    $('#dropdownMenuLinkSort span').text(sortValue);
    fetchAndDisplayCourses();
});
// Appels pour récupérer les données (placés après les définitions de fonctions)
fetchQuotes();
fetchPopularTutorials();
fetchLatestVideos();
fetchAndDisplayCourses();
});