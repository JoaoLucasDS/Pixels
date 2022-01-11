const container = document.querySelector('.container')
const sizeEl = document.querySelector('.size')
const color = document.querySelector('.color')
const resetBtn = document.querySelector('.btn')

// Getting the value of the size input
let size = sizeEl.value

function populate(size) {
    // Updating the --size CSS variable
    container.style.setProperty('--size', size)
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement('div')
        div.classList.add('pixel')

        container.appendChild(div)
    }
}

populate(size)