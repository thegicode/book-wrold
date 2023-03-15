import { CustomEventEmitter, CustomFetch } from '../../utils/index.js'
import { hasLibrary } from '../../modules/model.js'

export default class Library extends HTMLElement {

	constructor() {
		super()
		this.form = this.querySelector('form')
	}

	connectedCallback() {
		CustomEventEmitter.add('set-detail-region', this.handleDetailRegion.bind(this))
	}

	disconnectedCallback() {
		CustomEventEmitter.remove('set-detail-region', this.handleDetailRegion)
	}

	async fetchLibrarySearch(detailRegionCode) {
		try {
			const url = `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`
			const data = await CustomFetch.fetch(url)
			this.render(data)
		} catch(error) {
			console.error(error)
            throw new Error('Fail to get library search data.')
		}
	}

	render(data) {
		const { pageNo, pageSize, numFound, resultNum, libs } = data

		if (libs.length === 0) {
            this.showMessage('notFound')
            return
		}

		const template = document.querySelector('#tp-item').content.firstElementChild
		const fragment = libs.reduce((fragment, lib) => {
			const element = template.cloneNode(true)
			element.data = lib
			if(hasLibrary(lib.libCode)) {
				element.dataset.has = true
				fragment.insertBefore(element, fragment.firstChild)
			} else {
				fragment.appendChild(element)
			}
			return fragment
		}, new DocumentFragment())

		this.form.innerHTML = ''
		this.form.appendChild(fragment)
	}

	showMessage(type) {
		const tpl = document.querySelector(`#tp-${type}`)
		const el = tpl.content.firstElementChild.cloneNode(true)
		this.form.innerHTML = ''
        this.form.appendChild(el)
	}

	handleDetailRegion({ detail }) {
		this.showMessage('loading')
		this.fetchLibrarySearch(detail.detailRegionCode)
	}

}