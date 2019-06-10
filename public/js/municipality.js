let province, district;

(function ($) {

    selectizeFilter();

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


        if (!$('#modal_name').val() || !$('#modal_province').val() || !$('#modal_district').val() ||
            !$('#modal_population').val() || !$('#modal_mayor').val()) {

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
            province: $('#modal_province').val(),
            district: $('#modal_district').val(),
            population: $('#modal_population').val(),
            mayor: $('#modal_mayor').val(),
            mho: $('#modal_mho').val() + " - " + $('#mho_contact').val(),
            pdoh: $('#modal_pdoh').val() + " - " + $('#pdoh_contact').val(),
            dmo: $('#modal_dmo').val() + " - " + $('#dmo_contact').val(),
            mun_engr: $('#modal_mun_engr').val() + " - " + $('#mun_engr_contact').val(),
            LGU: $('#modal_lgu').val() + " - " + $('#lgu_contact').val(),
            point_person: $('#modal_hfep').val() + " - " + $('#hfep_contact').val()
        };

        if ($('#modal_add').text() == 'Add') {
            insertMunicipal(data);
        } else {
            data['id'] = $('.modal-title').attr('id');
            updateMunicipal(data);
        }
    });

    $('#add_municipality').on('hidden.bs.modal', function (e) {
        $(this)
            .find("input")
            .val('')
            .end();

        $('#error_container').html('');
        $('#modal_add').text('Add');
        $('#modal_add').show();
        $('#modal_cancel').show();
        $('.modal-title').text('Add Municipality');
    });
})(jQuery);

function selectizeFilter() {
    let selectedVal;
    let $province;
    let $district;

    $province = $('#province_filter').selectize({
        onChange: function (value) {
            selectedVal = $('#district_filter').val();

            district.disable();
            district.clearOptions();
            loadDistrict();
            district.trigger("change");
        }
    });

    $district = $('#district_filter').selectize({
        valueField: 'district',
        labelField: 'label',
        searchField: ['label'],
        onChange: function (value) {
            getCountMuncity();
        }
    });

    district = $district[0].selectize;
    province = $province[0].selectize;

    loadDistrict();
    $('.default.selectize-control.demo-default.single').removeAttr('style');

    function loadDistrict() {
        district.load(function (callback) {
            const param = '?province=' + $('#province_filter').val();
            fetch('/API/muncity/get_districts' + param, { method: 'GET' })
                .then(res => res.json())
                .then(data => {
                    district.enable();
                    callback(data);

                    const arr = data;

                    if (arr.some(item => item.district == selectedVal)) {
                        district.setValue(selectedVal, 1);
                    } else {
                        district.setValue("");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    district.trigger("change");
}

function insertMunicipal(data) {
    fetch('/API/muncity/insert', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.text())
        .then(data => {
            if (data == "success") {
                toastr.success("Successfully saved.");
                province.trigger("change");
            } else {
                toastr.error("An error has occured.");
            }

            $('#add_municipality').modal('hide');
        })
        .catch(err => {
            console.log(err);
        });
}

function updateMunicipal(data) {
    fetch('/API/muncity/update', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.text())
        .then(data => {
            if (data == "success") {
                toastr.success("Successfully saved.");
                province.trigger("change");
            } else {
                toastr.error("An error has occured.");
            }

            $('#add_municipality').modal('hide');
        })
        .catch(err => {
            console.log(err);
        });
}

function deleteMunicipal(id) {
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
                    fetch('/API/muncity/delete' + param, { method: 'GET' })
                        .then(res => res.text())
                        .then(data => {
                            if (data == "success") {
                                toastr.success("Successfully deleted.");
                                province.trigger("change");
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

function getCountMuncity() {
    const param = '?province=' + $('#province_filter').val() +
        '&district=' + $('#district_filter').val();

    fetch('/API/muncity/count' + param, { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            populate_pager(data[0].count);
        })
        .catch(err => {
            console.log(err);
        });
}

function getMuncities(offset) {
    const param = '?province=' + $('#province_filter').val() +
        '&district=' + $('#district_filter').val() + '&offset=' + offset + '&limit=' + 5;

    fetch('/API/muncity/get_municipalities' + param, { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            populate_table(data);
            // getCountMuncity();
        })
        .catch(err => {
            console.log(err);
        });
}

// function getDistricts() {
//     const param = '?province=' + $('#province_filter').val();

//     fetch('/API/muncity/get_districts' + param, { method: 'GET' })
//         .then(res => res.json())
//         .then(data => {
//             populate_districts(data);
//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

// function populate_districts(data) {
//     let options = "<option value=''>All District</option>";
//     for (let i = 0; i < data.length; i++) {
//         if (data[i].district == $('#district_filter').val()) {
//             options += "<option value='" + data[i].district + "'  selected='selected'>District " + data[i].district + "</option>"
//         }
//         else {
//             options += "<option value='" + data[i].district + "'>District " + data[i].district + "</option>"
//         }
//     }

//     $('#district_filter').html(options);

//     const offset = ($('.current:not(.prev)').html() - 1) * 5;

//     if (!isNaN(offset)) {
//         getMuncities(offset);
//     } else {
//         getMuncities(0);
//     }

// }

function populate_table(data) {
    let table_data = '';
    for (let i = 0; i < data.length; i++) {
        table_data += "<tr class='tr-shadow'>"
            + "<td>" + data[i].name + "</td>"
            + "<td>"
            + "<span class='block-email'>" + data[i].province + "</span>"
            + "</td>"
            + "<td class='desc'>District " + data[i].district + "</td>"
            + "<td>" + data[i].mayor + "</td>"
            // + "<td>"
            // + "<span class='status--process'>Processed</span>"
            // + "</td>"
            + "<td>" + data[i].population.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>"
            + "<td>"
            + "<div class='table-data-feature'>"
            + "<button id='" + data[i].id + "' class='item' data-toggle='tooltip' data-placement='top' title='Edit' onclick='editMunicipality(" + JSON.stringify(data[i]) + ")'>"
            + "<i class='zmdi zmdi-edit'></i>"
            + "</button>"
            + "<button class='item' data-toggle='tooltip' data-placement='top' title='Delete' onclick='deleteMunicipal(" + data[i].id + ")'>"
            + "<i class='zmdi zmdi-delete'></i>"
            + " </button>"
            + "<button class='item' data-toggle='tooltip' data-placement='top' title='View' onclick='viewMunicipality(" + JSON.stringify(data[i]) + ")'>"
            + "<i class='zmdi zmdi-search'></i>"
            + " </button>"
            // + "<button class='item' data-toggle='tooltip' data-placement='top' title='More'>"
            // + "<i class='zmdi zmdi-more'></i>"
            // + " </button>"
            + "</div>"
            + " </td>"
            + " </tr>"
            + "<tr class='spacer'></tr>";

        if (i == data.length - 1) $('#table_data').html(table_data);
    }
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
            getMuncities((pageNumber - 1) * 5);
        }
    });

    const offset = (page - 1) * 5;

    if (!isNaN(offset) && numItems > offset ) {
        getMuncities(offset);
    } else {
        getMuncities(0);
    }
}

function viewMunicipality(data) {
    editMunicipality(data);
    $('#modal_add').hide();
    $('#modal_cancel').hide();
    $('.modal-title').text('View Municipality');
}

function editMunicipality(data) {
    $('.modal-title').text('Edit Municipality');
    $('#add_municipality').modal('show');

    $('#modal_add').text('UPDATE');
    $('.modal-title').attr("id", data.id);

    $('#modal_name').val(data.name);
    $('#modal_province').val(data.province).change();
    $('#modal_district').val(data.district);
    $('#modal_population').val(data.population);
    $('#modal_mayor').val(data.mayor);

    const mho_info = data.MHO_CHO.split(" - ");
    $('#modal_mho').val(mho_info[0])
    $('#mho_contact').val(mho_info[1]);

    const pdoh_info = data.PDOH.split(" - ");
    $('#modal_pdoh').val(pdoh_info[0])
    $('#pdoh_contact').val(pdoh_info[1]);

    const dmo_info = data.DMO.split(" - ");
    $('#modal_dmo').val(dmo_info[0])
    $('#dmo_contact').val(dmo_info[1]);

    const engr_info = data.MUN_ENGR.split(" - ");
    $('#modal_mun_engr').val(engr_info[0])
    $('#mun_engr_contact').val(engr_info[1]);

    const lgu_info = data.LGU.split(" - ");
    $('#modal_lgu').val(lgu_info[0])
    $('#lgu_contact').val(lgu_info[1]);

    const hfep_info = data.POINT_PERSON.split(" - ");
    $('#modal_hfep').val(hfep_info[0])
    $('#hfep_contact').val(hfep_info[1]);
}