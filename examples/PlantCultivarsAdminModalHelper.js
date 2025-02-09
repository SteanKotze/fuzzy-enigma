class PlantCultivarsAdminModalHelper extends GenericModalManager {
    //#region --- static modal gets ---
    static getCreateModal(defaultPlantSpeciesId) {
        modalManager.pushTarget()
        showLoadingModal("Fetching Plant Cultivars Creation Modal...")

        htmx.ajax(
            "GET",
            "/plants/cultivars/create-modal?PlantSpeciesId=" + defaultPlantSpeciesId,
            {
                target: ".modal-target",
                swap: "outerHTML"
            }
        ).then(_ => {
            modalManager.push(new PlantCultivarsAdminModalHelper())
            hideLoadingModal()
        })
    }

    static getUpdateModal(plantCultivarId) {
        modalManager.pushTarget()
        showLoadingModal("Fetching Plant Cultivars Update Modal...")

        htmx.ajax(
            "GET",
            `/plants/cultivars/${plantCultivarId}/update-modal`,
            {
                target: ".modal-target",
                swap: "outerHTML"
            }
        ).then(_ => {
            modalManager.push(new PlantCultivarsAdminModalHelper())
            hideLoadingModal()
        })
    }
    //#endregion

    //#region --- APIs ---
    update() {
        Swal.fire({
            title: 'Are you sure you want to update this plant cultivars?',
            showCancelButton: true,
            cancelButtonColor: '#959696',
            confirmButtonColor: '#83cc16',
            confirmButtonText: 'Yes, update it!',
            showClass: { popup: '' },
            hideClass: { popup: '' }
        }).then((result) => {
            if (result.isConfirmed) {
                document.body.dispatchEvent(
                    new Event(`submit-plant-cultivars-update-form-${this.modalId}`)
                )
            }
        })
    }

    delete(plantCultivarId) {
        Swal.fire({
            title: 'Are you sure you want to delete this plant cultivars?',
            showCancelButton: true,
            cancelButtonColor: '#959696',
            confirmButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, delete it!',
            showClass: { popup: '' },
            hideClass: { popup: '' }
        }).then((result) => {
            if (result.isConfirmed) {
                showLoadingModal("Deleting plant cultivars...")
                htmx.ajax(
                    "DELETE",
                    `/api/plants/cultivars/${plantCultivarId}`,
                    { swap: "none" }
                ).then(_ => hideLoadingModal())
            }
        })
    }
    //#endregion
}