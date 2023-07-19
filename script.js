$(document).ready(function() {
    const $gifArea = $("#gif-area");
    const $searchForm = $("#searchform");
    const $removeButton = $("#removeButton");
    const $searchButton = $("#searchButton");
    const $searchInput = $("#search");
    const $suggestionsContainer = $("<div>", { id: "suggestions-container" });

    $searchButton.on("click", function(event) {
        event.preventDefault();
        const searchTerm = $searchInput.val();
        searchGiphy(searchTerm);
        $searchInput.val(""); // Clear the input field
    });

    $searchInput.on("input", function() {
        const searchTerm = $searchInput.val();
        fetchApiData(searchTerm, function(apiData) {
            showSuggestions(apiData);
        });
    });

    $searchForm.append($suggestionsContainer);

    $removeButton.on("click", function() {
        $gifArea.empty();
    });

    function fetchApiData(searchTerm, callback) {
        const apiKey = "GLT3gcqeUC5Z5mDmTGAJmXMRSpTIq1wE";
        const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;

        axios
            .get(apiUrl)
            .then(function(response) {
                const data = response.data;
                const apiData = data.data.map(gif => ({
                    title: gif.title,
                    url: gif.images.original.url
                }));
                callback(apiData);
            })
            .catch(function(error) {
                console.log("An error has been encountered while fetching data from Giphy!", error);
            });
    }

    function searchGiphy(searchTerm) {
        const apiKey = "GLT3gcqeUC5Z5mDmTGAJmXMRSpTIq1wE";
        let apiUrl;

        if (searchTerm) {
            apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;
        } else {
            apiUrl = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`;
        }

        axios
            .get(apiUrl)
            .then(function(response) {
                const data = response.data;
                const gifs = searchTerm ? data.data : [data.data];
                if (gifs.length > 0) {
                    $gifArea.empty(); // Clear previous GIFs
                    gifs.forEach(function(gif) {
                        const gifUrl = gif.images.original.url;
                        appendGif(gifUrl);
                    });
                }
            })
            .catch(function(error) {
                console.log("An error has been encountered while searching Giphy!", error);
            });
    }

    function appendGif(url) {
        const $col = $("<div>", { class: "col" });
        const $gifContainer = $("<div>", { class: "gif-container" });
        const $gif = $("<img>", { src: url });
        const $copyButton = $("<div>", { class: "copy-button" });

        // const $clipboardIcon = $("<i>", { class: "fas fa-clipboard fa-2x" });
        const $clipboardIcon = $("<i>", { class: "fas fa-copy fa-2x", style: "color: #188f00;" });
        // const $clipboardIcon = $("<i>", { class: "fa-duotone fa-copy", style: "--fa-primary-color: #00ff33; --fa-secondary-color: #00ff33;"});
        // const $button = $("<button>", { class: "Btn" });
        // const $textSpan = $("<span>", { class: "text" }).text("Copy");
        // const $svgSpan = $("<span>", { class: "svgIcon" });
        // const $svg = $("<svg>", { fill: "white", viewBox: "0 0 384 512", height: "1em", xmlns: "http://www.w3.org/2000/svg" });
        // const $path = $("<path>", { d: "M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" });

        // $button.append($textSpan);
        // $svg.append($path);
        // $svgSpan.append($svg);
        // $button.append($svgSpan);

        $copyButton.append($clipboardIcon);
        // $copyButton.append($button);

        $copyButton.on("click", function() {
            const tempInput = $("<input>");
            $("body").append(tempInput);
            tempInput.val(url).select();
            document.execCommand("copy");
            tempInput.remove();
            alert("GIF link copied to clipboard!");
        });

        $gifContainer.append($gif);
        $gifContainer.append($copyButton);
        $col.append($gifContainer);
        $gifArea.append($col);
    }

    function showSuggestions(apiData) {
        $suggestionsContainer.empty(); // Clear previous suggestions

        const suggestions = apiData.map(gif => gif.title);
        suggestions.forEach(function(suggestion) {
            const $suggestion = $("<div>", { class: "suggestion" });
            $suggestion.text(suggestion);
            $suggestion.on("click", function() {
                $searchInput.val(suggestion);
                searchGiphy(suggestion);
                $suggestionsContainer.empty(); // Clear suggestions after selection
            });
            $suggestionsContainer.append($suggestion);
        });

        if (suggestions.length === 0) {
            $suggestionsContainer.hide(); // Hide suggestions if there are none
        } else {
            $suggestionsContainer.show(); // Show suggestions
        }
    }

    // Close suggestions when clicking outside the search input
    $(document).on("click", function(event) {
        if (!$(event.target).closest($searchInput).length) {
            $suggestionsContainer.empty();
        }
    });

});
