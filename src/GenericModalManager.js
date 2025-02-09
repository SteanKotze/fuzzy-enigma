class GenericModalManager {
    constructor() {
        this.elementId = null
        this.modalId = null
    }

    open(target) {
        this.elementId = $(target).attr("id")
        this.modalId = $(target).attr("modal-id")
        if (typeof(this["afterOpen"]) === "function") 
            this["afterOpen"]()
    }

    hide() {
        $(`#${this.elementId}`).addClass("hidden")
    }

    unhide() {
        $(`#${this.elementId}`).removeClass("hidden")
    }

    close() {
        $(`#${this.elementId}`).remove()
        this.elementId = null
        this.modalId = null
    }
}