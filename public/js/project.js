let province, muncity, facility, source, years;
let modalFacility, modalSource, modalYear, modalAgency, modalStatus, modalContractor;
let upload;

(function ($) {
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

    upload = new FileUploadWithPreview('myFilePicker');

    getProjects();

    $('#add-image').click(function () {
        $('#file_picker').trigger('click');
    });

    $currentDate = new Date();
    for (let i = $currentDate.getFullYear(); i > 1990; i--) {
        $('#modal_year').append("<option value='" + i + "'>" + i + "</option>");
    }

    selectizeFilter();
    selectizeModal();

    $('#modal_image').click(function () {
        $('#file_picker').trigger('click');
    });

    $("#file_picker").change(function () {
        readURL(this);
    });

    $('#modal_add').click(function () {
        if (!$('#modal_name').val() || !$('#modal_facility').val() || !$('#modal_source').val() ||
            !$('#modal_year').val() || !$('#modal_start').val() || !$('#modal_end').val() ||
            !$('#modal_allotment').val() || !$('#modal_status').val() || !$('#modal_agency').val()) {

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

        uploadImages();
    });

    $('#add_project').on('hidden.bs.modal', function (e) {
        $(this)
            .find("input")
            .val('')
            .end();

        $('#error_container').html('');
        $('#image_holder').html('');

        $('#modal_remark').val('');

        $('#modal_image').attr('src', 'images/add-image.jpg');

        $('#modal_add').text('Add');
        $('#modal_add').show();
        $('#modal_cancel').show();
        $('.modal-title').text('Add Project');

        upload.clearPreviewPanel();

        modalFacility.setValue('');
        modalSource.setValue('');
        modalYear.setValue('');
        modalAgency.setValue('');
        modalStatus.setValue('');

    });
})(jQuery);

function selectizeFilter() {
    let $province, $muncity, $facility, $source, $year;

    $province = $('#province_filter').selectize({
        onChange: function (value) {
            muncity.disable();
            muncity.clearOptions();
            loadMuncity();
            getProjects();
        }
    });

    $muncity = $('#muncity_filter').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        onChange: function (value) {
            facility.disable();
            facility.clearOptions();
            loadFacility(facility, $('#muncity_filter').val());
            getProjects();
        }
    });

    $facility = $('#facility_filter').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        onChange: function (value) {
            years.disable();
            years.clearOptions();
            loadYear();
            getProjects();
        }
    });

    $source = $('#source_filter').selectize({
        onChange: function (value) {
            getProjects();
        }
    });

    $year = $('#year_filter').selectize({
        valueField: 'funding_year',
        labelField: 'funding_year',
        searchField: ['funding_year'],
        onChange: function (value) {
            getProjects();
        }
    });

    province = $province[0].selectize;
    muncity = $muncity[0].selectize;
    facility = $facility[0].selectize;
    years = $year[0].selectize;

    loadMuncity();
    loadFacility(facility, $('#muncity_filter').val());
    loadYear();
    $('.default.selectize-control.demo-default.single').removeAttr('style');
}

function selectizeModal() {
    let $modalFacility, $modalSource, $modalYear, $modalAgency, $modalStatus, $modalContractor;

    $('#dp_start').datepicker()
        .on('changeDate', function (ev) {
            $('#dp_start').datepicker('hide');
        });

    $('#dp_end').datepicker()
        .on('changeDate', function (ev) {
            $('#dp_end').datepicker('hide');
        });

    $modalFacility = $('#modal_facility').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        onChange: function (value) {

        }
    });

    $modalSource = $('#modal_source').selectize();

    $modalYear = $('#modal_year').selectize();

    $modalAgency = $('#modal_agency').selectize();

    $modalStatus = $('#modal_status').selectize();

    $modalContractor = $('#modal_contractor').selectize();

    modalFacility = $modalFacility[0].selectize;
    modalSource = $modalSource[0].selectize;
    modalYear = $modalYear[0].selectize;
    modalAgency = $modalAgency[0].selectize;
    modalStatus = $modalStatus[0].selectize;
    modalContractor = $modalContractor[0].selectize;

    loadFacility(modalFacility, '');
}

function insertProject(body) {
    fetch('/API/project/insert', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status == "success") {
                toastr.success("Successfully saved.");
                $('#add_project').modal('hide');
                facility.trigger('change');
            } else {
                toastr.error("An error has occured.");
            }
        })
}

function editProject(data) {
    $('.modal-title').text('Edit Facility');
    $('#add_project').modal('show');

    $('#modal_add').text('UPDATE');
    $('.modal-title').attr("id", data.id);

    $('#modal_name').val(data.name);

    modalFacility.setValue(data.facility_id);

    modalSource.setValue(data.fund_source);
    modalYear.setValue(data.funding_year);

    modalAgency.setValue(data.agency);

    modalStatus.setValue(data.status);

    $('#modal_start').val(data.start_date.split('T')[0]);
    $('#modal_end').val(data.end_date.split('T')[0]);
    $('#modal_allotment').val(data.allotment);

    // var images = [];
    // const imagePaths = JSON.parse(data.images);
    // for (let i = 0; i < imagePaths.length; i++) {
    //     fetch(imagePaths[i])
    //         .then(res => res.blob())
    //         .then(blob => {
    //             const file = new File([blob], imagePaths[i].split("\\")[2], blob);
    //             upload.processFile(file);
    //             images.push(file);
    //         })

    //     if (i == imagePaths.length - 1) {
    //         console.log(images.length);
    //         upload.addFiles(images);
    //         console.log(upload.currentFileCount);
    //     }
    // }
    upload.addImagesFromPath(JSON.parse(data.images));
}

function getProjects() {
    const param = '?province=' + $('#province_filter').val() +
        '&muncity=' + $('#muncity_filter').val() +
        '&facility=' + $('#facility_filter').val() +
        '&source=' + $('#source_filter').val() +
        '&year=' + $('#year_filter').val();

    fetch('/API/project/get_projects' + param, { method: 'GET' })
        .then(res => res.json())
        .then(data => {
            populate_projects(data);
        })
        .catch(err => {
            console.log(err);
        });
}

function loadMuncity() {
    muncity.load(function (callback) {
        const param = '?province=' + $('#province_filter').val() + '&district=&offset=&limit=';

        fetch('/API/muncity/get_municipalities' + param, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                muncity.enable();
                callback(data);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

function loadFacility(selectize, muncityFilter) {
    selectize.load(function (callback) {
        const param = '?muncity=' + muncityFilter +
            '&type=&offset=&limit=';

        fetch('/API/facility/get_facilities' + param, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                selectize.enable();
                callback(data);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

function loadYear() {
    years.load(function (callback) {
        const param = '?facilityId=' + $('#facility_filter').val();

        fetch('/API/project/get_funding_years' + param, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                years.enable();
                callback(data);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

function readURL(input) {
    $('#image_holder').html('');

    const size = $("#file_picker")[0].files.length;

    for (let i = 0; i < size; i++) {
        if (input.files && input.files[i]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                console.log(e);
                if (i == 0) {
                    $('#modal_image').attr('src', e.target.result);
                }
                else {
                    $('#image_holder').append(
                        '<img id="modal_image' + i + '" src="images/add-image.jpg" class="img-fluid" alt="#" style="width:100px; height:100px; padding: 10px 5px">'
                    );
                    $('#modal_image' + i).attr('src', e.target.result);
                }
            }

            reader.readAsDataURL(input.files[i]);
        }
    }
}

function uploadImages() {
    let form = upload.cachedFileArray;
    let formData = new FormData();

    const projectName = $('#modal_name').val();

    for (let i = 0; i < form.length; i++) {
        let item = form[i];

        if (item.constructor === Blob) {
            console.log('pasok');
            item = new File([item], item.name.split('\\')[2], {
                type: "image/jpeg",
                lastModified: Date.now()
            });
        }

        console.log(item);
        formData.append(projectName, item);
    }



    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {

            let images = [];
            for (let i = 0; i < data.length; i++) {
                const path = data[i].path;
                images.push(path.substring(7));
            }

            const body = {
                name: $('#modal_name').val(),
                facility: $('#modal_facility').val(),
                source: $('#modal_source').val(),
                year: $('#modal_year').val(),
                start_date: $('#modal_start').val(),
                end_date: $('#modal_end').val(),
                allotment: $('#modal_allotment').val(),
                agency: $('#modal_agency').val(),
                status: $('#modal_status').val(),
                contractor: $('#modal_contractor').val(),
                remarks: $('#modal_remarks').val(),
                images: images
            };

            if ($('#modal_add').text() == 'Add') {
                insertProject(body);
            } else {
                console.log(images);
            }

        })
        .catch(err => {
            console.log(err);
        });
}

function populate_projects(data) {
    let project_data = '';
    project_data += '<div class="row">';

    for (let i = 0; i < data.length; i++) {
        let indicator = '';
        let carouselInner = '';
        let carouselId = data[i].name + data[i].id;
        carouselId = carouselId.replace(/\s/g, '');

        const images = JSON.parse(data[i].images);

        project_data += '<div class="col-md-4 col-sm-12 m-b-20">'
            + '<div id="' + carouselId + '" class="carousel slide" data-ride="carousel" data-interval="5000">';

        indicator += '<ol class="carousel-indicators">';
        carouselInner += '<div class="carousel-inner">';

        for (let j = 0; j < images.length; j++) {

            if (j == 0) {
                carouselInner += '<div class="item active">';
                indicator += '<li data-target="' + carouselId + '" data-slide-to="' + j + '" class="active"></li>';
            }
            else {
                carouselInner += '<div class="item">';
                indicator += '<li data-target="' + carouselId + '" data-slide-to="' + j + '"></li>';
            }


            carouselInner += '<img id="' + data[i].name + "_image" + '" src="' + images[j] + '" class="w-100" alt="#" style="height:250px">'
                + '</div>';
        }

        indicator += '</ol>'
        carouselInner += '</div>';

        project_data += indicator;
        project_data += carouselInner;

        if (images.length > 1) {
            project_data += '<a class="left carousel-control" href="#' + carouselId + '" data-slide="prev">'
                + '<span class="glyphicon glyphicon-chevron-left"></span>'
                + '<span class="sr-only">Previous</span>'
                + '</a>'
                + '<a class="right carousel-control" href="#' + carouselId + '" data-slide="next">'
                + '<span class="glyphicon glyphicon-chevron-right"></span>'
                + '<span class="sr-only">Next</span>'
                + '</a>';
        }

        project_data += '</div>'
            + '<div class="project-info">'
            + '<h3>' + data[i].name + '</h3>'
            + '<p>₱ ' + (parseInt(data[i].allotment)).toLocaleString() + '</p> <span>• </span>'
            + '<p style="color: green">' + data[i].status + '</p>'

            + '<ul>'
            + '<li>'
            + '<i class="fas fa-map-marker-alt"></i>'
            + '<p style="margin-left:10px">' + (data[i].facility).split('***')[0] + '</p>'
            + '</li>'
            + '<li>'
            + '<i class=""></i>'
            + '<p style="margin-left:22px">' + (data[i].facility).split('***')[1] + '</p>'
            + '</li>'
            + '<li>'
            + '<i class="fas fa-chart-bar"></i>'
            + '<p style="margin-left:7px"> Engr. John Doe</p>'
            + '</li>'
            + '<li>'
            + '<i class="fas fa-calendar-alt"></i>'
            + '<p style="margin-left:9px">' + data[i].fund_source + " " + data[i].funding_year + '</p>'
            + '</li>'

            + '</ul>'

            + '<div class="bottom-icons">'
            + "<button class='btn btn-link' style='font-size: 15px' onclick='editProject(" + JSON.stringify(data[i]) + ")'>View More</button>"
            + '</div>'
            + '</div>'
            + '</div>'
    }

    project_data += '</div>';
    $('#project_container').html(project_data);
}