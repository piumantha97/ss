'use strict';

(function ($) {
    let mixer; // Declare a global MixItUp instance

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        // Initialize MixItUp on load
        initializeMixItUp();

        // Load default category and subcategory
        loadProducts('gifts', 'boxes');
    });

    /*------------------
        Initialize MixItUp
    --------------------*/
    function initializeMixItUp() {
        const containerEl = document.querySelector('.property__gallery');
        if (containerEl) {
            // Initialize MixItUp
            mixer = mixitup(containerEl, {
                selectors: {
                    target: '.mix',
                },
                animation: {
                    duration: 300,
                },
            });
        }
    }

    /*------------------
        Reinitialize MixItUp
    --------------------*/
    window.reinitializeMixItUp = function () {
        if (mixer) {
            mixer.destroy(); // Destroy the previous instance
        }
        initializeMixItUp(); // Reinitialize MixItUp
    };

    /*------------------
        Reinitialize Magnific Popup
    --------------------*/
    function reinitializeMagnificPopup() {
        $('.image-popup').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            gallery: {
                enabled: true, // Allows grouping images into a gallery
            },
        });
    }

    /*------------------
        Load Products
    --------------------*/
    window.loadProducts = function (category, subcategory) {
        console.log("Loading products for:", category, subcategory);

        // Fetch data from the JSON file
        $.ajax({
            url: 'products.json', // Path to the JSON file
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const categoryData = data[category]; // Get category data
                if (!categoryData || !categoryData[subcategory]) {
                    console.log(categoryData);
                    // alert("No products found for this category!",data);
                    return;
                }

                const products = categoryData[subcategory]; // Get specific subcategory data

                // Clear existing products
                $('#product-container').empty();

                // Generate and append products
                products.forEach(product => {
                    const productHtml = `
                    <div class="col-lg-4 col-md-6 mix ${category}">
                        <div class="product__item">
                            <div class="product__item__pic" style="background-image: url('${product.image}'); height: 300px; background-size: cover;">
                                <ul class="product__hover">
                                    <li>
                                        <a href="${product.image}" class="image-popup" data-image="${product.image}">
                                            <span class="arrow_expand"></span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="product__item__text">
                                <h6><a href="#">${product.name}</a></h6>
                                <div class="rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </div>
                                <div class="product__price">$${product.price.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>`;
                    $('#product-container').append(productHtml);
                });

                // Reinitialize MixItUp and Magnific Popup after loading products
                if (window.reinitializeMixItUp) {
                    window.reinitializeMixItUp();
                }
                reinitializeMagnificPopup();
            },
            error: function (error) {
                console.error('Error loading products:', error);
            }
        });
    };

    /*------------------
        Filter Control Click
    --------------------*/
    $(document).on('click', '.filter__controls li', function () {
        $('.filter__controls li').removeClass('active');
        $(this).addClass('active');

        const filterValue = $(this).data('filter');
        if (mixer) {
            mixer.filter(filterValue); // Apply MixItUp filter
        }
    });

    /*------------------
        Magnific Popup
    --------------------*/
    reinitializeMagnificPopup();

})(jQuery);
