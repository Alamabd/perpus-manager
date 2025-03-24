const person = document.getElementById('name')
const book = document.getElementById('book')
const borrow = document.getElementById('borrow')
const labelBorrow = document.getElementById('labelBorrow')
const returned = document.getElementById('returned')
const labelReturned = document.getElementById('labelReturned')

let newField = {
    name: '',
    book: '',
    borrow: '',
    returned: ''
}

const formatDateString = (dateString) => {
    const parts = dateString.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}-${month}-${year}`;
}

const dateNow = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${year}-${month}-${day}`
}

const setLabelDate = (el, date) => {
    el.innerHTML = `
    ${formatDateString(date)}
    <svg class="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 8H4V19H20V8ZM15.0355 10.136L16.4497 11.5503L11.5 16.5L7.96447 12.9645L9.37868 11.5503L11.5 13.6716L15.0355 10.136Z"></path></svg>`
}


// New book
const handleChange = async (value, type) => {    
    newField[type] = value
    const { name, book, borrow, returned } = newField
    if(name.length > 0 && book.length > 0 && borrow.length > 0 && returned.length > 0) {
        await window.books.addBook(newField)
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <th>${2}</th>
            <td class="text-nowrap">${name}</td>
            <td class="text-nowrap">${book}</td>
            <td>${formatDateString(borrow)}</td>
            <td>${formatDateString(returned)}</td>
            <td id="statusbook${lastid}" class="text-nowrap cursor-pointer" onclick="changeStatus(${lastid + 1}, '${name}',  'pinjam')">
                <div class="inline-grid *:[grid-area:1/1]">
                <div class="status ${'pinjam' == 'pinjam' ?  'status-warning' : 'pinjam' == 'telat' ? 'status-error' : 'status-primary'} animate-pulse"></div>
                </div> pinjam
            </td>`
        listBooks.insertAdjacentElement('afterend', tr)
        setTimeout(() => {
            resetField()
            console.log(newField);   
        }, 100);
    }
}

person.addEventListener('change', () => handleChange(person.value, 'name'))
book.addEventListener('change', () => handleChange(book.value, 'book'))

borrow.addEventListener('change', () => {
    if(borrow.value) {
        handleChange(borrow.value, 'borrow')
        setLabelDate(labelBorrow, borrow.value)
    } else {
        labelBorrow.innerText = 'Enter disini'
    }
})
labelBorrow.addEventListener('click', () => {
    borrow.showPicker()
})

returned.addEventListener('change', () => {
    if(returned.value) {
        handleChange(returned.value, 'returned')
        setLabelDate(labelReturned, returned.value)
        console.log('change returned')
    } else {
        labelReturned.innerText = 'Enter disini'
    }
})
labelReturned.addEventListener('click', () => {
    returned.showPicker()
})


// Get books
const listBooks = document.getElementById('listBooks')
let lastid
const getBooks = async () => {
    const books = await window.books.getBook()
    lastid = books[0].id
    let els = ""
    books.forEach((book, idx) => {
        els += `<tr>
        <th>${idx + 2}</th>
        <td class="text-nowrap">
            <input class="outline-none" type="text" value="${book.name}" />
        </td>
        <td class="text-nowrap">
            <input class="outline-none" type="text" value="${book.title}" />
        </td>
        <td class="text-nowrap">${formatDateString(book.borrow)}</td>
        <td class="text-nowrap">${formatDateString(book.returned)}</td>
        <td id="statusbook${book.id}" class="text-nowrap cursor-pointer" onclick="changeStatus(${book.id}, '${book.name}', '${book.status}')">
            <div class="inline-grid *:[grid-area:1/1]">
            <div class="status ${book.status == 'pinjam' ?  'status-warning' : book.status == 'telat' ? 'status-error' : 'status-primary'} animate-pulse"></div>
            </div> ${book.status}
        </td>
        </tr>`
    })
    listBooks.insertAdjacentHTML('afterend', els)
}


const resetField = () => {
    const today = dateNow()
    newField = {
        name: '',
        book: '',
        borrow: today,
        returned: ''
    }
    borrow.value = today
    setLabelDate(labelBorrow, today)
    returned.value = undefined
    labelReturned.innerText = 'Enter disini'
    person.value = null
    book.value = null
}


// Alert
const btnNo = document.getElementById('alertNo')
const btnYes = document.getElementById('alertYes')
const alertMessage = document.getElementById('alertMessage')
const alert = document.getElementById('alert')
let alertState = {
    show: false,
    tagetId: 0
}

const openAlert = (message) => {
    if(!alertState.show) {
        alertState.show = true
        alertMessage.innerText = message
        alert.classList.add('show-alert')
    }
}

btnNo.addEventListener('click', () => {
    if(alertState.show) {
        alertState.show = false
        alert.classList.remove('show-alert')
    }
})
btnYes.addEventListener('click', async () => {
    if(alertState.show) {
        await window.books.changeStatusBook(alertState.tagetId, 'pinjam')
        const el = document.getElementById(`statusbook${alertState.tagetId}`)
        el.innerHTML = `
            <div class="inline-grid *:[grid-area:1/1]">
                <div class="status status-warning animate-pulse"></div>
            </div> pinjam
        `
        alertState.show = false
        alert.classList.remove('show-alert')
    }
})

// Change status Book
const changeStatus = async (id, name, status) => {
    if(status === 'pinjam' || status === 'telat') {
        await window.books.changeStatusBook(id, 'dikembalikan')
        const el = document.getElementById(`statusbook${id}`)
        el.innerHTML = `
            <div class="inline-grid *:[grid-area:1/1]">
                <div class="status status-primary animate-pulse"></div>
            </div> dikembalikan
        `
    } else {
        alertState.tagetId = id
        openAlert(`${name} sudah mengembalikan buku (oke untuk kembali pinjam)`)
    }
}

// First APP load
const loaded = () => {
    getBooks()
    resetField()
}

