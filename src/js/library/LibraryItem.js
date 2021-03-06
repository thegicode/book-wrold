import model from '../model.js'
const  { state, addLibrary, deleteLibrary, includesLibrary } = model


export default class LibraryItem extends HTMLElement {
	constructor() {
		super()
		this.checkbox = this.querySelector('[name=myLibrary]')
	}

	connectedCallback() {
		this.render(this.data)
		this.checkbox.addEventListener('change', this.onChange.bind(this))
	}

	disConnectedCallback() {
		this.checkbox.removeEventListener('change', this.onChange.bind(this))
	}

	render() {
		const {
			libCode,
			libName,
			address,
			tel,
			fax,
			// latitude,
			// longitude,
			homepage,
			closed,
			operatingTime,
			BookCount } = this.data

		const obj = {
            libCode: `${libCode}`,
            libName: `${libName}`,
            address: `${address}`,
            tel: `${tel}`,
            fax: `${fax}`,
            homepage: `${homepage}`,
            closed: `${closed}`,
            operatingTime: `${operatingTime}`,
            BookCount: `${Number(BookCount).toLocaleString()}`,
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.${key}`).textContent = value
        }
        this.querySelector('.homepage').href = homepage

        const includes = includesLibrary(libCode)
        this.checkbox.checked = includes
        this.libCode = libCode
        this.libName = libName
	}

	onChange(event) {
		if (event.target.checked) {
			addLibrary(this.libCode, this.libName)
			return
		}
		deleteLibrary(this.libCode)
	}

}