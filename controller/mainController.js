
exports.index = function(req, res){
    res.redirect('/dashboard');
}

exports.dashboard = function(req, res){
    res.render('dashboard');
}

exports.municipality = function(req, res){
    res.render('municipality');
}

exports.facility = function(req, res){
    res.render('facility');
}

exports.project = function(req, res){
    res.render('project');
}