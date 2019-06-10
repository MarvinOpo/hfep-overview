let filterMunicipality, filterType, modalMunicipality, modalType;

(function ($) {

    // getFacilities();
    selectizeFilter();
    selectizeModal();

    // $('#type_filter').change(function () {
    //     getFacilities();
    // });

    $('#add_facility').on('hidden.bs.modal', function (e) {
        $(this)
            .find("input")
            .val('')
            .end();

        $('#error_container').html('');
        $('#modal_add').text('Add');
        $('#modal_add').show();
        $('#modal_cancel').show();
        $('.modal-title').text('Add Facility');
    });

    $('#modal_add').click(function () {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };


        if (!$('#modal_name').val() || !$('#modal_municipal').val() || !$('#modal_beds').val() ||
            !$('#modal_type').val() || !$('#modal_address').val() || !$('#modal_license').val()) {

            const text_error = "<div class='input-error'>"
                + "<span class='error-text'>"
                + "Please fill all required fields (*)"
                + "</span>"
                + "</div>"

            $('#error_container').html(text_error);

            return;
        } else {
            $('#error_container').html('');
        }

        const data = {
            name: $('#modal_name').val(),
            muncity: $('#modal_municipal').val(),
            beds: $('#modal_beds').val(),
            type: $('#modal_type').val(),
            address: $('#modal_address').val(),
            license: $('#modal_license').val()
        };

        if ($('#modal_add').text() == 'Add') {
            insertFacility(data);
        } else {
            data['id'] = $('.modal-title').attr('id');
            updateFacility(data);
        }
    });
})(jQuery);

function selectizeFilter() {
    let selectedVal;
    let $municipality;
    let $type;

    $municipality = $('#muncity_filter').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        onChange: function (value) {
            selectedVal = $('#type_filter').val();

            filterType.disable();
            filterType.clearOptions();
            loadType();

            filterType.trigger("change");
        }
    });

    $type = $('#type_filter').selectize({
        valueField: 'type',
        labelField: 'type',
        searchField: ['type'],
        onChange: function(value){
            getCountFacility();
        }
    });

    filterType = $type[0].selectize;
    filterMunicipality = $municipality[0].selectize;
    filterMunicipality.load(function (callback) {
        const param = '?province=&district=&offset=&limit=';

        fetch('/API/muncity/get_municipalities' + param, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                callback(data);
            })
            .catch(err => {
                console.log(err);
            });
    });

    loadType();

    $('.default.selectize-control.demo-default.single').removeAttr('style', 'width: 100%;');

    function loadType() {
        filterType.load(function (callback) {
            const param = '?muncity=' + $('#muncity_filter').val();
            fetch('/API/facility/get_types' + param, { method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    filterType.enable();
                    callback(data);
                    filterType.setValue(selectedVal, 1)
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    filterType.trigger("change");
}

function selectizeModal() {
    let $municipality = $('#modal_municipal').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
    });

    modalMunicipality = $municipality[0].selectize;
    modalMunicipality.load(function (callback) {
        const param = '?province=&district=&offset=&limit=';

        fetch('/API/muncity/get_municipalities' + param, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                callback(data);
            })
            .catch(err => {
                console.log(err);
            });
    });

    let $type = $('#modal_type').selectize({
        create: true,
        sortField: 'text'
    });

    modalType = $type[0].selectize;
}

function insertFacility(data) {
    fetch('/API/facility/insert', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status == "success") {
                toastr.success("Successfully saved.");
                $('#add_facility').modal('hide');
                filterMunicipality.trigger("change");
            } else {
                toastr.error("An error has occured.");
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function editFacility(data) {
    $('.modal-title').text('Edit Facility');
    $('#add_facility').modal('show');

    $('#modal_add').text('UPDATE');
    $('.modal-title').attr("id", data.id);

    $('#modal_name').val(data.name);

    modalMunicipality.setValue(data.muncity_id);

    $('#modal_beds').val(data.no_of_bed);

    modalType.setValue(data.type);

    $('#modal_address').val(data.address);
    $('#modal_license').val(data.license);
}

function updateFacility(data){
    fetch('/API/facility/update', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        .then(data => {
            if (data.status == "success") {
                toastr.success("Successfully saved.");
                $('#add_facility').modal('hide');
                filterMunicipality.trigger("change");
            } else {
                toastr.error("An error has occured.");
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function deleteFacility(id) {
    const param = '?id=' + id;

    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.positionClass = "toast-top-center";
    toastr.warning('<div class="text-center"><label>Are you sure you want to delete this item?</label>'
        + '<button type="button" id="okBtn" class="btn btn-danger" value="yes">Yes</button>'
        + '<button type="button" id="surpriseBtn" class="btn btn-secondary" style="margin: 0 8px 0 8px" value="no">No</button></div>',
        "",
        {
            allowHtml: true,
            onclick: function (toast) {
                toastr.options.timeOut = 2000;
                toastr.options.extendedTimeOut = 1000;
                toastr.options.positionClass = "toast-bottom-right";
                value = toast.target.value
                if (value == 'yes') {
                    fetch('/API/facility/delete' + param, { method: 'GET' })
                        .then(res => res.json())
                        .then(data => {
                            if (data.status == "success") {
                                toastr.success("Successfully deleted.");
                                filterMunicipality.trigger("change");
                            } else {
                                toastr.error("An error has occured.");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }

                toastr.remove();
            }

        });
}

function getCountFacility() {
    const param = '?muncity=' + $('#muncity_filter').val() +
        '&type=' + $('#type_filter').val();

    fetch('/API/facility/count' + param, { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            populate_pager(data[0].count);
        })
        .catch(err => {
            console.log(err);
        });
}

function getFacilities(offset) {
    const param = '?muncity=' + $('#muncity_filter').val() +
        '&type=' + $('#type_filter').val() + '&offset=' + offset + '&limit=' + 5;

    fetch('/API/facility/get_facilities' + param, { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            populate_table(data)
        })
        .catch(err => {
            console.log(err);
        });
}

function populate_table(data) {
    let table_data = '';
    for (let i = 0; i < data.length; i++) {
        table_data += "<tr class='tr-shadow'>"
            + "<td>" + data[i].name + "</td>"
            + "<td>"
            + "<span class='block-email'>" + data[i].muncity + "</span>"
            + "</td>"
            + "<td class='desc'>" + data[i].type + "</td>"
            + "<td>" + data[i].address + "</td>"
            + "<td>" + data[i].no_of_bed + "</td>"
            + "<td>"
            + "<div class='table-data-feature'>"
            + "<button id='" + data[i].id + "' class='item' data-toggle='tooltip' data-placement='top' title='Edit' onclick='editFacility(" + JSON.stringify(data[i]) + ")'>"
            + "<i class='zmdi zmdi-edit'></i>"
            + "</button>"
            + "<button class='item' data-toggle='tooltip' data-placement='top' title='Delete' onclick='deleteFacility(" + data[i].id + ")'>"
            + "<i class='zmdi zmdi-delete'></i>"
            + " </button>"
            // + "<button class='item' data-toggle='tooltip' data-placement='top' title='View' onclick='viewMunicipality(" + JSON.stringify(data[i]) + ")'>"
            // + "<i class='zmdi zmdi-search'></i>"
            // + " </button>"
            + "</div>"
            + " </td>"
            + " </tr>"
            + "<tr class='spacer'></tr>";
    }

    $('#table_data').html(table_data);
}

function populate_pager(numItems) {
    let page = ($('.current:not(.prev)').html());

    if (page > Math.ceil(numItems / 5)) page = 1;

    $(".pager_container").html('');

    var perPage = 5;

    $(".pager_container").pagination({
        items: numItems,
        itemsOnPage: perPage,
        cssStyle: "light-theme",
        currentPage: page,

        onPageClick: function (pageNumber) {
            getFacilities((pageNumber - 1) * 5);
        }
    });

    const offset = (page - 1) * 5;

    if (!isNaN(offset) && numItems > offset ) {
        getFacilities(offset);
    } else {
        getFacilities(0);
    }
}