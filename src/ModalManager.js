class ModalManager {
    //#region --- constructor && variables ---
    constructor() {
        this.modals = []
        this.top = -1

        document.body.addEventListener(
            "modal-manager-pop", 
            () => this.pop()
        )

        document.body.addEventListener(
            "modal-manager-double-pop", 
            () => {
                this.pop()
                this.pop()
            }
        )
    }
    //#endregion

    pushTarget() {
        var existingTarget = $(".modal-target")[0]
        if (existingTarget === null || existingTarget === undefined)
            $("#modals-container").append("<div class='modal-target'></div>")
    }

    push(target, backDropIsClose = false, backDropFade = "medium", callbacks = []) {
        var unmanagedTarget = htmx.find("[modal-is-managed='false']")
        if (unmanagedTarget === null || unmanagedTarget === undefined)
            return toastr.error("ModalManager: Could not find modal when pushing")

        unmanagedTarget = $(unmanagedTarget)
        unmanagedTarget.attr("modal-is-managed", "true")

        target.open(unmanagedTarget)

        if (this.top === -1) {
            $("#modals-container").removeClass("hidden").addClass("flex")
        } else {
            this.modals[this.top].modal.hide()
            this.removeBlur[this.modals[this.top].backDropFade]()
        }

        this.addBlur[backDropFade]()
        this.modals.push({
            modal: target,
            modalId: target.modalId,
            callbacks: callbacks,
            backDropIsClose: backDropIsClose,
            backDropFade: backDropFade
        })
        this.top++
    }

    pop() {
        if (this.top === -1)
            return toastr.error("ModalManager.Pop: No modals to pop")

        this.removeBlur[this.modals[this.top].backDropFade]()
        this.modals[this.top].modal.close()
        this.modals.pop()
        this.top--

        if (this.modals.length === 0) 
            $("#modals-container").addClass("hidden").removeClass("flex")
        else {
            this.modals[this.top].modal.unhide()
            this.addBlur[this.modals[this.top].backDropFade]()
        }
    }

    popFromBackdrop(event) {
        if (!event || event.srcElement.getAttribute("id") !== "modals-container")
            return
        if (this.top === -1)
            return toastr.error("ModalManager.PopFromBackdrop: No modals to pop")
        if (this.modals[this.top].backDropIsClose) {
            window.postMessage("ModalManager-popFromBackdrop", "*")
            this.pop()
        }
    }

    proxy(functionName, ...data) {
        if (this.modals.length < 1)
            return console.error("ModalManager: No modals to procy to", functionName, data)
        var helper = this.modals[this.top].modal
        if (typeof helper[functionName] !== "function")
            return toastr.error("ModalManager: Could not find function when passing through")

        return helper[functionName](...data)
    }

    propagateCallback(callbackName, entity_id, entity) {
        this.modals.forEach(entity_modal => {
            if (entity_modal.modal.entityId !== entity_id)
                return
            if (entity_modal.callbacks.includes(callbackName)  === false)
                return
            entity_modal.modal[callbackName](entity)
        })
    }

    addBlur = {
        "xxs": () => htmx.find("#modals-container").classList.add("backdrop-blur-xxs"),
        "xs": () => htmx.find("#modals-container").classList.add("backdrop-blur-xs"),
        "sm": () => htmx.find("#modals-container").classList.add("backdrop-blur-sm"),
        "medium": () => htmx.find("#modals-container").classList.add("backdrop-blur"),
        "lg": () => htmx.find("#modals-container").classList.add("backdrop-blur-lg"),
        "xl": () => htmx.find("#modals-container").classList.add("backdrop-blur-xl"),
        "2xl": () => htmx.find("#modals-container").classList.add("backdrop-blur-2xl")
    }

    removeBlur = {
        "xxs": () => htmx.find("#modals-container").classList.remove("backdrop-blur-xxs"),
        "xs": () => htmx.find("#modals-container").classList.remove("backdrop-blur-xs"),
        "sm": () => htmx.find("#modals-container").classList.remove("backdrop-blur-sm"),
        "medium": () => htmx.find("#modals-container").classList.remove("backdrop-blur"),
        "lg": () => htmx.find("#modals-container").classList.remove("backdrop-blur-lg"),
        "xl": () => htmx.find("#modals-container").classList.remove("backdrop-blur-xl"),
        "2xl": () => htmx.find("#modals-container").classList.remove("backdrop-blur-2xl")
    }
}

const modalManager = new ModalManager()
function proxyToModalManager(functionName, ...data) {
    if (modalManager === null || modalManager === undefined)
        return toastr.error("ModalManager: Could not find modal manager")
    return modalManager.proxy(functionName, ...data)
}
