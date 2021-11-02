//AJAX Variable
const BASE_URL = `https://ghibliapi.herokuapp.com/films/`

// cached elements
const $form = $('form');
const $input = $("input[type='text'");
const $submit = $('input[type="submit"');
const $title = $('.title');
const $rating = $('.ratingScore');
const $director = $('.directorName');
const $producer = $('.producerName');
const $movieLength = $('.movieLengthTime');
const $releaseDate = $('.releaseDateYear');
const $description = $('.description');
const $image = $('.image');
const $cardArea = $('#cardArea');
const $add = $('.add');
const $home = $('.home');
const $viewList = $('.viewList');

// variables
let movieList = [];
let userList = [];

$submit.on('click', handleClick);
$add.on('click', addToList);
$home.on('click', backHandle)
$viewList.on('click', yourList);



// handles user input and returns information
function handleClick(event){
        event.preventDefault();
        $userInput = $input.val();
        if($userInput !== ''){
          for(movie of movieList){
             if($userInput.toLowerCase() === movie.title.toLowerCase()){
                $title.text(`${movie.title}`);
                $rating.text(`${movie.rating}`);
                $director.text(`${movie.director}`);
                $producer.text(`${movie.producer}`);
                $movieLength.text(`${movie.movieLength}`);
                $releaseDate.text(`${movie.releaseDate}`)
                $description.text(`${movie.description}`);
                $image.attr('src', `${movie.image}`)
                $('h1').text('');
                //clears page to only show movie thats been searched
                $cardArea.empty()
                // goes back to main screen
              }
          }
          $input.val('')
          $('#searched').removeClass('hide')
          $home.prop('disabled', false)
        }
      }

// display movies upon first entering site
function runAPI(){
    $.ajax({
        url: BASE_URL
    }).then(
        (data) => {
            for(movie of data){
                let movieInfo = {};
                movieInfo.description = movie.description;
                movieInfo.director = movie.director;
                movieInfo.producer = movie.producer;
                movieInfo.releaseDate = movie.release_date;
                movieInfo.title = movie.title;
                movieInfo.rating = movie.rt_score;
                movieInfo.movieLength = movie.running_time;
                movieInfo.image = movie.image;
                movieList.push(movieInfo);
            }
            makeCards(movieList);
    },
    (error) => {
        console.log('bad request: ', error)
    }
    )
}

// makes card display on home page
function makeCards(list){
    for(movie of list){
        $cardArea.append(`
        <div class="card" style="background-image: url('${movie.image}');">
        <div class="card-body" >
            <h5 class="card-title">${movie.title}</h5>
        </div>
        </div>
        `)
    }
    $home.prop('disabled', true)
    addHover();
    cardClick();
}

//adds hover effect to cards
function addHover(){
    $('.card-body').on('mouseenter', function(){
        $(this).children('.card-title').addClass('hover')
    })
    $('.card-body').on('mouseleave', function(){
        $(this).children('.card-title').removeClass('hover')
    })
}

//renders page/info on card clicked
function cardClick(){
    $('.card-body').on('click', function(){
        for(movie of movieList){
            if($(this).children('.card-title').text() === movie.title){
                $title.text(`${movie.title}`);
                $rating.text(`${movie.rating}`);
                $director.text(`${movie.director}`);
                $producer.text(`${movie.producer}`);
                $movieLength.text(`${movie.movieLength}`);
                $releaseDate.text(`${movie.releaseDate}`)
                $description.text(`${movie.description}`);
                $image.attr('src', movie.image)
                $('h1').text('')
                //clears page to only show movie thats been searched
                $cardArea.empty()
                // goes back to main screen
            }
            $home.prop('disabled', false)
            $('#searched').removeClass('hide')
        }
    
    })
}

function backHandle(evt){
    evt.preventDefault();
    $('#searched').addClass('hide')
    $('h1').text('Studio Ghibli API')
    makeCards(movieList);
    cardClick();
}

function addToList(){
    //creates an object to store the pages info
    let userListMovie = {};
    //updates the object with info
    userListMovie.title = $title.text();
    userListMovie.image = $image.attr('src');
    userListMovie.director = $director.text();
    userListMovie.producer = $producer.text();
    userListMovie.movieLength = $movieLength.text();
    userListMovie.releaseDate = $releaseDate.text();
    userListMovie.rating = $rating.text();
    //pushes object into userList array
    userList.push(userListMovie)
    console.log(userList)
}

//renders a page of all movies user has added to list
function yourList(){
    if(userList.length > 0){
    $('#cardArea').empty()
    makeCards(userList);
    $('#searched').addClass('hide')
    $('h1').text('Studio Ghibli API')
    $home.prop('disabled', false)
    }
}

runAPI();