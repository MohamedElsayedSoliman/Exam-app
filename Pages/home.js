const imageContainer = document.getElementById('image-container')

const detailContainer = document.getElementById('detail-container')

const ingredientContainer = document.getElementById('ingredient-container')
const areaContainer = document.getElementById('area-container')
const catogeryContainer = document.getElementById('catogery-container')
const itemsContainer = document.getElementById('items-container')
const areaDetailContainer = document.getElementById('areadetail-container')
const ingredientDetailContainer = document.getElementById(
  'ingredientdetail-container'
)

let inputStatus = {
  firstName: false,
  email: false,
  phone: false,
  age: false,
  password: false,
  repeatPassword: false,
}
const passwords = []

const validateInput = (input, regex) => {
  if (!regex.test(input.value.trim())) {
    input.classList.add('is-invalid')
    input.nextElementSibling.classList.add('is-invalid')
    input.nextElementSibling.classList.remove('d-none')
    input.nextElementSibling.classList.add('d-block')
    input.nextElementSibling.nextElementSibling.classList.add('d-none')
    inputStatus[input.id] = false
    console.log(inputStatus, 'false') // update inputStatus to false
    return null
  } else {
    input.classList.remove('is-invalid')
    input.nextElementSibling.classList.remove('is-invalid')
    input.nextElementSibling.classList.add('d-none')
    input.nextElementSibling.nextElementSibling.classList.remove('d-block')

    if (input.id === 'password') {
      passwords.push(input.value.trim())
    } else if (input.id === 'repeatpassword') {
      matchPasswords(input)
    }

    inputStatus[input.id] = true
    console.log(inputStatus, 'true')

    return input.value.trim()
  }
}

const matchPasswords = (input) => {
  const repeatPasswordRegex = new RegExp(`^${passwords[passwords.length - 1]}$`)
  if (!repeatPasswordRegex.test(input.value.trim())) {
    input.classList.add('is-invalid')
    input.nextElementSibling.classList.add('is-invalid')
    input.nextElementSibling.classList.remove('d-none')
    input.nextElementSibling.classList.add('d-block')
    input.nextElementSibling.nextElementSibling.classList.add('d-none')
    inputStatus[input.id] = false // update inputStatus to false
    console.log(inputStatus, 'falsematch')
    return null
  } else {
    input.classList.remove('is-invalid')
    input.nextElementSibling.classList.remove('is-invalid')
    input.nextElementSibling.classList.add('d-none')
    input.nextElementSibling.nextElementSibling.classList.remove('d-block')

    inputStatus[input.id] = true
    console.log(inputStatus, 'truematch')
    return input.value.trim()
  }
}

const checkButton = (button) => {
  const allInputsValid = Object.values(inputStatus).every(
    (status) => status === true
  )
  console.log(allInputsValid)

  if (allInputsValid) {
    button.disabled = false // enable the button
    button.style.background = '#008B8B'
    button.style.color = 'white'
    button.style.borderColor = ''
  } else {
    button.disabled = true // disable the button
    button.style.backgroundColor = 'black'
    button.disabled = false
  }
}

console.log(inputStatus)

const search = document.getElementById('search')

function getNameInputValue(searchName) {
  if (searchName) {
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchName}`
    ).then((data) => {
      const meals = data.meals

      const imageUrl = meals.map((meal) => {
        return `<div class="col-md-3 py-2 cont position-relative z-0" onClick="detailMeal(${meal.idMeal})">
                <img
                  src="${meal.strMealThumb}"
                  class="w-100 h-100 rounded-2 image"
                  style="object-fit: cover"
                />
                <div class="middle d-flex justify-content-between ">
                 <h2 style="font-size:20px;">${meal.strMeal}</h2>
                </div>
              </div>`
      })
      if (search) {
        search.innerHTML = `<div class="row">
                                  ${imageUrl.join('')}
                                </div>`
      }
    })
  }
}

function getInputLetterValue(searchLetter) {
  if (searchLetter) {
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchLetter}`
    ).then((data) => {
      const meals = data.meals

      const imageUrl = meals.map((meal) => {
        return `<div class="col-md-3 py-2 cont position-relative z-0" onClick="detailMeal(${meal.idMeal})">
                <img
                  src="${meal.strMealThumb}"
                  class="w-100 h-100 rounded-2 image"
                  style="object-fit: cover"
                />
                <div class="middle d-flex justify-content-between ">
                 <h2  style="font-size:20px;">${meal.strMeal}</h2>
                </div>
              </div>`
      })
      if (search) {
        search.innerHTML = `<div class="row">
                                  ${imageUrl.join('')}
                                </div>`
      }
    })
  }
}

const dataMeals = []
const fetchData = async (url) => {
  try {
    const response = await fetch(url)
    const data = await response.json()
    dataMeals.push(data.meals)
    return data
  } catch (error) {
    console.log(error)
  }
}

fetchData('https://www.themealdb.com/api/json/v1/1/search.php?s=').then(
  (data) => {
    const meals = data.meals

    const imageUrl = meals.map((meal) => {
      return `<div class="col-md-3 py-2 cont position-relative z-0" onClick="detailMeal(${meal.idMeal})">
                <img
                  src="${meal.strMealThumb}"
                  class="w-100 h-100 rounded-2 image"
                  style="object-fit: cover"
                />
                <div class="middle d-flex justify-content-between ">
                 <h2>${meal.strMeal}</h2>
                </div>
              </div>`
    })
    if (imageContainer) {
      imageContainer.innerHTML = `<div class="row">
                                  ${imageUrl.join('')}
                                </div>`
    }
  }
)

//

function detailMeal(idMeal) {
  localStorage.setItem('selectedMealId', idMeal) // Store the ID in localStorage
  window.location.href = 'detail.html'
}

const selectedMealId = localStorage.getItem('selectedMealId')
// Retrieve the stored ID

if (selectedMealId) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedMealId}`
  )
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0]
      const tag1 = meal.strTags ? meal.strTags.split(',')[0] : null
      const tag2 = meal.strTags ? meal.strTags.split(',')[1] : null

      const detailInformation = `<div class="row">
          <div class="col-md-6 position-relative z-0">
            <img src="${
              meal.strMealThumb
            }" class="w-100  rounded-2 " style="object-fit: cover" />
            <h2 class="text-white">${meal.strMeal}</h2>
            </div>
          <div class="col-md-6">
          <h2 class="text-white">Instruction</h2>
            
            <p class="text-white">${meal.strInstructions}</p>
            <h4 class="text-white text-bold">Area: ${meal.strArea}</h4>
            <h3 class="text-white text-bold">Category: ${meal.strCategory}</h3>
            <h5 class="text-white text-bold"> Recipes:</h5>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${Array.from({ length: 20 }, (_, i) => i + 1)
              .map((index) => {
                const ingredient = meal[`strIngredient${index}`]
                const measure = meal[`strMeasure${index}`]
                return ingredient && measure
                  ? `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`
                  : ''
              })
              .join('')}
                    </ul>
                    <h3 class="text-white"> Tags:  </h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${
                      tag1
                        ? `<li class="alert alert-danger m-2 p-1">${tag1}</li>`
                        : ''
                    }
                    ${
                      tag2
                        ? `<li class="alert alert-danger m-2 p-1">${tag2}</li>`
                        : ''
                    }
                    </ul>
                    <a target="_blank" href="${
                      meal.strSource
                    }" class="btn btn-success">Source</a>
                    <a target="_blank" href="${
                      meal.strYoutube
                    }" class="btn btn-danger">Youtube</a>
          </div>
        </div>`
      if (detailContainer) {
        detailContainer.innerHTML = detailInformation
      }
    })
}

fetchData('https://www.themealdb.com/api/json/v1/1/list.php?i=list').then(
  (data) => {
    const meals = data.meals

    const imageUrl = meals.splice(0, 20).map((meal) => {
      return `<div class="col-md-3 position-relative z-0">
                <div onClick="getIngredientsMeals('${
                  meal.strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
                        <h3 class="text-white">${meal.strIngredient.substring(
                          0,
                          15
                        )}</h3>
                        <p class="text-white"> ${meal.strDescription.substring(
                          0,
                          150
                        )}</p>
                </div>
        </div>
              `
    })
    if (ingredientContainer) {
      ingredientContainer.innerHTML = `<div class="row">
                                  ${imageUrl.join('')}
                                </div>`
    }
  }
)

fetchData('https://www.themealdb.com/api/json/v1/1/list.php?a=list').then(
  (data) => {
    const meals = data.meals
    // console.log(meals)

    const imageUrl = meals.splice(0, 20).map((meal) => {
      return `<div class="col-md-3 cursor-pointer position-relative z-0" onClick="getAreaMeals('${meal.strArea}')">
                <div  class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x text-white mt-2"></i>
                        <h3 class="text-white mt-2 cursor-pointer">${meal.strArea}</h3>

                </div>
        </div>
              `
    })
    if (areaContainer) {
      areaContainer.innerHTML = `<div class="row">
                                  ${imageUrl.join('')}
                                </div>`
    }
  }
)

fetchData('https://www.themealdb.com/api/json/v1/1/categories.php').then(
  (data) => {
    const meals = data.categories
    // console.log(meals)

    const imageUrl = meals.map((meal) => {
      return `<div class="col-md-3 position-relative z-0">
    <div onClick="getCategoryMeals('${meal.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer p-2">
    <img class="w-100 " src="${meal.strCategoryThumb}" alt="">
    <div class="meal-layer position-absolute text-center text-black p-2">
        <h3>${meal.strCategory}</h3>
        <p>${meal.strCategoryDescription}</p>
    </div>
</div>
        </div>

              `
    })
    if (catogeryContainer) {
      catogeryContainer.innerHTML = `<div class="row">
                                  ${imageUrl.join('')}
                                </div>`
    }
  }
)

function getCategoryMeals(mealCatogery) {
  localStorage.setItem('selectedmealCatogery', mealCatogery)

  window.location.href = 'catogerydetail.html'
}

const selectedMealCatogery = localStorage.getItem('selectedmealCatogery')

if (selectedMealCatogery) {
  console.log(selectedMealCatogery)
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedMealCatogery}`
  )
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals
      const imageUrl = meals.map((meal) => {
        return `<div class="col-md-3 py-2 cont position-relative z-0" onClick="detailMeal(${
          meal.idMeal
        })">
                <img
                  src="${meal.strMealThumb}"
                  class="w-100 h-100 rounded-2 image"
                  style="object-fit: cover"
                />
                <div class="middle d-flex justify-content-between">
                 <h2 style="font-size: 20px;">${meal.strMeal.substring(
                   0,
                   15
                 )}</h2>
                </div>
              </div>`
      })
      if (itemsContainer) {
        itemsContainer.innerHTML = `<div class="row">
        ${imageUrl.join('')}
      </div>`
      }
    })
}

function getAreaMeals(areaMeal) {
  localStorage.setItem('selectedMealArea', areaMeal)

  window.location.href = 'areadetail.html'
}

const selectedMealArea = localStorage.getItem('selectedMealArea')

if (selectedMealArea) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedMealArea}`
  )
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals
      const imageUrl = meals.map((meal) => {
        return `<div class="col-md-3 py-2 cont position-relative z-0" onClick="detailMeal(${
          meal.idMeal
        })">
                <img
                  src="${meal.strMealThumb}"
                  class="w-100 h-100 rounded-2 image"
                  style="object-fit: cover"
                />
                <div class="middle d-flex justify-content-between">
                 <h2 style="font-size: 20px;">${meal.strMeal.substring(
                   0,
                   15
                 )}</h2>
                </div>
              </div>`
      })
      if (areaDetailContainer) {
        areaDetailContainer.innerHTML = `<div class="row">
        ${imageUrl.join('')}
      </div>`
      }
    })
}

function getIngredientsMeals(ingredientMeal) {
  localStorage.setItem('selectedingredientMeal', ingredientMeal)

  window.location.href = 'ingredientdetail.html'
}

const selectedIngredientMeal = localStorage.getItem('selectedingredientMeal')

if (selectedIngredientMeal) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredientMeal}`
  )
    .then((response) => response.json())
    .then((data) => {
      const meals = data.meals
      const imageUrl = meals.map((meal) => {
        return `<div class="col-md-3 py-2 cont position-relative z-0" onClick="detailMeal(${
          meal.idMeal
        })">
                <img
                  src="${meal.strMealThumb}"
                  class="w-100 h-100 rounded-2 image"
                  style="object-fit: cover"
                />
                <div class="middle d-flex justify-content-between">
                 <h2 style="font-size: 20px;">${meal.strMeal.substring(
                   0,
                   15
                 )}</h2>
                </div>
              </div>`
      })
      if (ingredientDetailContainer) {
        ingredientDetailContainer.innerHTML = `<div class="row">
        ${imageUrl.join('')}
      </div>`
      }
    })
}

function openNav() {
  const nav = document.querySelector('#nav')
  const sidebarBtn = document.querySelector('#sidebarBtn')
  const icon = document.querySelector('#icon')

  nav.classList.remove('d-none')

  sidebarBtn.classList.add('d-none')
  icon.classList.remove('d-none')
  icon.classList.add('d-block')

  nav.classList.add('d-block')

  const contains = nav.classList.contains('d-block')

  if (contains) {
    nav.classList.add('visible')
  }
}

function closeNav() {
  const icon = document.querySelector('#icon')
  const nav = document.querySelector('#nav')
  const sidebarBtn = document.querySelector('#sidebarBtn')
  icon.classList.remove('d-none')

  icon.classList.add('d-none')
  sidebarBtn.classList.remove('d-none')
  sidebarBtn.classList.add('d-block')
  nav.classList.add('d-none')

  const contains = nav.classList.contains('d-none')

  if (contains) {
    nav.classList.remove('visible')
  }
}
