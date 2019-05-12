/*******************************************************************
/*******************************************************************
/*
/*	ValidationJS v1.01
/*	Written by Engr. James Levi Crisostomo, CpE
/*	Exclusive use for NERDLAB ENTERPRISE
/*	nerdlabenterprise@gmail.com
/*	www.nerdlabenterprise.com
/*	facebook.com/nerdlabenterprise
/*
/*******************************************************************
/******************************************************************/

const ValidationJS = {

	extend: function(src, dst) {

		var keys = Object.keys(src);

			for(i = 0; i <= (keys.length - 1); i++) {
				dst[keys[i]] = src[keys[i]];
			}

		return dst;
	},

	define: function(prop, value) {
		return typeof prop !== 'undefined' ? prop : value;
	},

	NUMBERS: [0,1,2,3,4,5,6,7,8,9],

	UPPERCASE_LETTERS: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],

	LOWERCASE_LETTERS: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],

	SPECIAL_CHARACTERS: ['`','~','!','@','#','$','%','^','&','*','(',')','_','-','+','=','{','[',']','}','|','\\',':',';','"','\'','<',',','.','>','?','/'],

	ALPHA_NUMERIC: [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],

	test: function(arg) {

		var code = -1,
			name = ValidationJS.define(arg.name, null),
			text = ValidationJS.define(arg.text, null),
			min = ValidationJS.define(arg.minlength, 0),
			max = ValidationJS.define(arg.maxlength, 255),
			minline = ValidationJS.define(arg.minline, 1),
			maxline = ValidationJS.define(arg.maxline, 1),
			minword = ValidationJS.define(arg.minword, 1),
			maxword = ValidationJS.define(arg.maxword, 1),
			optional = ValidationJS.define(arg.optional, false),
			nospaces = ValidationJS.define(arg.nospaces, false),
			numeric = ValidationJS.define(arg.numeric_only, false),
			num_min = ValidationJS.define(arg.numeric_min, 0),
			num_max = ValidationJS.define(arg.numeric_max, 0),
			pattern = ValidationJS.define(arg.pattern, null),
			prohibit = ValidationJS.define(arg.prohibit, []),
			prohibit_except = ValidationJS.define(arg.prohibit_except, []),
			noerror_msg = ValidationJS.define(arg.noerror_msg, null);

			if(text && text.length > 0) {

				if(text.length >= min) {

					if(text.length <= max) {

						var lines = text.split("\n").length;

						if(lines >= minline) {

							if(lines <= maxline) {

								var spaces = text.trim().split(" ");

								if(nospaces) {
									if(spaces.length > 1) {
										code = 6;
									}
								}

								if(code == -1) {

									if(spaces.length >= minword) {

										if(spaces.length <= maxword) {

											if(numeric) {
												var spt = text.split(""),
													hit = 0;

													for(i = 0; i <= (spt.length - 1); i++) {
														if(ValidationJS.NUMBERS.indexOf(parseInt(spt[i])) !== -1) {
															hit++;
														}
													}

													if(hit != spt.length) {
														var parse = parseInt(text);
														if(parse) {
															if(parse.toString().length != text.length) {
																code = 9;
															}
															else {
																if(parseInt(text) >= num_min) {
																	if(parseInt(text) <= num_max) {
																		code = -1;
																	}
																	else {
																		code = 11;
																	}
																}
																else {
																	code = 10;
																}
															}
														}
														else {
															code = 9;
														}
													}
													else {
														if(parseInt(text) >= num_min) {
															if(parseInt(text) <= num_max) {
																code = -1;
															}
															else {	
																code = 11;
															}
														}
														else {
															code = 10;
														}
													}

											}

											if(code == -1) {

												if(pattern) {

														var pat = pattern.split(","),
															invalid = true;

														if(pat.length > 0) {

															var all = [];

															for(j = 0; j <= (pat.length - 1); j++) {
																var item = pat[j],
																	wild = item.substring(item.length - 1, item.length),
																	is_wild = wild == "*" && item != "*" ? true : false;
																	if(is_wild) {
																		all.push(item);
																	}
																	else {
																		var digit = item.split("-").length-1;

																		if(digit == item.length && digit > 1) {
																			all.push(digit);
																		}
																		else {
																			var s = item.split("");
																			if(s.length > 1) {
																				for(i = 0; i <= (s.length - 1); i++) {
																					all.push(s[i]);
																				}
																			}
																			else {
																				all.push(s[0]);
																			}
																		}

																	}
															}
															
															var compare = [];

															for(j = 0; j <= (all.length - 1); j++) {
																var item = all[j],
																	wild = isNaN(item) ? item.substring(item.length - 1, item.length) : null,
																	is_wild = wild == "*" && item != "*" ? true : false;

																if(is_wild) {

																	compare.push(true);

																}
																else {

																	if(isNaN(item)) {

																	var digit = item.split("-").length-1;
																	
																	if(digit == item.length && digit > 1) {
																		compare.push(digit);
																	}
																	else {
																		compare.push(item);
																	}

																	}
																	else {
																		compare.push(item);
																	}

																}

															}

															if(compare.length > 0) {

																var char = [];

																if(prohibit && prohibit.length > 0) {

																	if(prohibit_except && prohibit_except.length > 0) {

																		for(k = 0; k <= (prohibit.length - 1); k++) {

																			if(prohibit_except.indexOf(prohibit[k]) === -1) {
																				char.push(prohibit[k].toString());
																			}

																		}

																	}
																	else {
																		char = prohibit;
																	}

																}

																var t = text.split(""),
																	n = 0,
																	hit = 0,
																	end = false,
																	inva = true,
																	test = function(sx) {

																		if(char.length > 0 && all.indexOf(sx) === -1) {

																			for(x = 0; x <= (char.length - 1); x++) {

																				if(typeof sx !== 'undefined') {
																				if(sx.toLowerCase() == char[x].toLowerCase() && inva) {
																					inva = false;
																					//console.log(sx.toLowerCase() + " " + char[x].toLowerCase());
																					//console.log("INVALID");
																					break;
																				}
																				}

																			}

																		}

																		return inva;
																	};
																	//console.log(prohibit);

																for(j = 0; j <= (compare.length - 1); j++) {
																	var pt = compare[j],
																		br = false;

																	if(typeof pt === 'boolean' && pt) {
																		for(k = n; k <= (t.length - 1); k++) {
																			var s = t[k],
																				next = compare[j+1];
																				if(!test(s)) {
																					br = true;
																					break;
																				}
																			if(typeof next !== 'undefined') {
																				if(s != next) {
																					n++;
																				}
																				else {
																					hit++;
																					break;
																				}
																			}
																			else {
																				n++;
																				if(!end) {
																					end = true;
																					hit++;
																				}
																			}
																		}
																	}
																	else if(typeof pt === 'number') {
																		var br_now = false;
																			
																			for(o = n; o <= ((n + pt)-1); o++) {
																				var st = t[o];
																				
																				if(!test(st)) {
																					br_now = true;
																					br = true;
																				}

																				/*if(s != pt) {
																					if(!test(s)) {
																						br_now = true;
																						br = true;
																					}
																				}
																				n++;
																				hit++;*/
																				//console.log(st);
																			}
																			if(br_now) {
																				break;
																			}
																		/*if(s != pt) {
																		if(!test(s)) {
																			br = true;
																			break;
																		}
																		}*/
																		n += pt;
																		hit++;
																		//console.log(" ");
																	}
																	else {
																		var s = t[n];
																			if(s != pt) {
																			if(!test(s)) {
																				br = true;
																				break;
																			}
																			}
																			if(s == pt) {
																				n += pt.length;
																				hit++;
																			}
																	}

																	if(br) {
																		break;
																	}

																}

																if(inva) {
																if(n != text.length || hit != compare.length) {
																	invalid = false;
																}
																}

															}

														}

														if(!inva) {
															code = 13;
														}
														else {
															if(!invalid) {
																code = 12;
															}
														}

												}
												else {

													if(prohibit && prohibit.length > 0) {

														var valid = true,
															spt = text.split(""),
															test = [];

														if(prohibit_except && prohibit_except.length > 0) {

															for(j = 0; j <= (prohibit.length - 1); j++) {
																if(prohibit_except.indexOf(prohibit[j]) === -1) {
																	test.push(prohibit[j]);
																}
															}

														}
														else {
															test = prohibit;
														}

														var n = 0;

														if(test.length > 0) {

															for(j = 0; j <= (spt.length - 1); j++) {
																if(test.indexOf(spt[j]) !== -1) {
																	if(!isNaN(spt[j])) {
																		n++;
																	}
																	valid = false;
																	break;
																}
															}

														}

														if(!valid) {
															if(n > 0) {
																code = 14;
															}
															else {
																code = 13;
															}
														}

													} 

												}

												if(code == -1) {

													if(noerror_msg != null) {
														code = 15;
													}

												}

											}

										}
										else {
											code = 8;
										}

									}
									else {
										code = 7;
									}

								}

							}
							else {
								code = 5;
							}

						}
						else {
							code = 4;
						}

					}
					else {
						code = 3;
					}

				}
				else {
					code = 2;
				}

			}
			else {
				if(!optional) {
					code = 1;
				}
			}

		return ValidationJS.extend({

			getResponseCode: function() {
				return code;
			},

			getResponseMessage: function() {
			var msg = '',
				strs = function(n, str) {
					return n > 1 ? str + 's' : str;
				};

				switch(code) {

					case 14:
					if(name) {
						msg = name + ' must not contain numbers.';
					}
					else {
						msg = 'This field must not contain numbers.';
					}
					break;

					case 13:
					if(name) {
						msg = name + ' must not contain prohibited ' + strs(prohibit.length, 'character') + '.';
					}
					else {
						msg = 'This field must not contain prohibited ' + strs(prohibit.length, 'character') + '.';
					}
					break;

					case 12:
					if(name) {
						msg = name + ' must be valid.';
					}
					else {
						msg = 'This field is invalid.';
					}
					break;

					case 11:
					if(name) {
						msg = name + ' must have a value not more than ' + num_max + '.';
					}
					else {
						msg = 'This field must have a value not more than ' + num_max + '.';
					}
					break;

					case 10:
					if(name) {
						msg = name + ' must have a value not less than ' + num_min + '.';
					}
					else {
						msg = 'This field must have a value not less than ' + num_min + '.';
					}
					break;

					case 9:
					if(name) {
						msg = name + ' must be a number.';
					}
					else {
						msg = 'This field must be a number.';
					}
					break;

					case 8:
					if(name) {
						msg = name + ' must not exceed of ' + maxword + ' ' + strs(maxword, 'word') + '.';
					}
					else {
						msg = 'This field must not exceed of ' + maxword + ' ' + strs(maxword, 'word') + '.';
					}
					break;

					case 7:
					if(name) {
						msg = name + ' must be at least ' + minword + ' ' + strs(minword, 'word') + '.';
					}
					else {
						msg = 'This field must be at least ' + minword + ' ' + strs(minword, 'word') + '.';
					}
					break;

					case 6:
					if(name) {
						msg = name + ' must not contain spaces.';
					}
					else {
						msg = 'This field must not contain spaces.';
					}
					break;

					case 5:
					if(name) {
						msg = name + ' must not exceed ' + maxline + ' ' + strs(maxline, 'line') + ' of text.';
					}
					else {
						msg = 'This field must not exceed ' + maxline + ' ' + strs(maxline, 'line') + ' of text.';
					}
					break;

					case 4:
					if(name) {
						msg = name + ' must only consist of ' + minline + ' ' + strs(minline, 'line') + ' of text.';
					}
					else {
						msg = 'This field must only consist of ' + minline + ' ' + strs(minline, 'line') + ' of text.';
					}
					break;

					case 3:
					if(name) {
						msg = name + ' must not exceed ' + max + ' ' + strs(max, 'character') + '.';
					}
					else {
						msg = 'This field must not exceed ' + max + ' ' + strs(max, 'character') + '.';
					}
					break;

					case 2:
					if(name) {
						msg = name + ' must have a minimum of ' + min + ' ' + strs(min, 'character') + '.';
					}
					else {
						msg = 'This field must have a minimum of ' + min + ' ' + strs(min, 'character') + '.';
					}
					break;

					case 1:
					if(name) {
						msg = name + ' must not be left empty.';
					}
					else {
						msg = 'Please do not leave this field empty.';
					}
					break;

					default:
					if(noerror_msg) {
						msg = noerror_msg;
					}
					else {
						msg = 'Unknown response code.';
					}
					break;

				}
				return msg;
			},

			isValid: function() {
				return code == -1 ? true : false;
			},

			getValidationName: function() {
				return name;
			},

			getText: function() {
				return text;
			}

		}, this);
	},

	number: function(arg) {
		return new ValidationJS.test({

			name: ValidationJS.define(arg.name, "number"),

			text: ValidationJS.define(arg.number.toString(), null),

			optional: ValidationJS.define(arg.optional, false),

			minlength: 1,

			maxlength: 9,

			numeric_only: true,

			numeric_min: ValidationJS.define(arg.min, 0),

			numeric_max: ValidationJS.define(arg.max, 100000000)

		});
	},

	zip: function(arg) {
		return new ValidationJS.test({

			name: "ZIP code (PH)",

			text: ValidationJS.define(arg.code.toString(), null),

			optional: ValidationJS.define(arg.zip_code, false),

			minlength: 4,

			maxlength: 4,

			numeric_min: 1000,

			numeric_max: 9999,

			numeric_only: true

		});
	},

	email: function(arg) {
		return new ValidationJS.test({

			name: "Email",

			text: ValidationJS.define(arg.email, null),

			minlength: 1,

			maxlength: 140,

			minline: 1,

			maxline: 1,

			minword: 1,

			maxword: 1,

			optional: ValidationJS.define(arg.optional, false),

			nospaces: true,

			pattern: ValidationJS.define(arg.all_service, false) ? "-*,@,-*,.,-*" : "-*,@gmail.com",

			prohibit: ValidationJS.SPECIAL_CHARACTERS,

			prohibit_except: ['-','_','.']

		});
	},

	password: function(arg) {

		var msg = '',
			continuation = true,

			text = ValidationJS.define(arg.password, null),
			spt = text.split(""),
			strength = ValidationJS.define(arg.strength, false),
			min_num = ValidationJS.define(arg.min_number, 0),
			min_uppercase = ValidationJS.define(arg.min_uppercase, 0),
			prohibit = ValidationJS.define(arg.specialchar_prohibit, false),
			calculate_score = function(s) {
				var score = 0,
					length = s.length,
					number = 0,
					lower = 0,
					upper = 0,
					deduction = 0,
					spechar = 0,
					repetition = [],
					patterns = ['123','123456','123456789','01230','456','789','345','qwerty','qwertyuiop','asdfghjkl','zxcvbnm','january','february','march','april','may','june','july','august','september','october','november','december'];

				if(strength) {

					if(length >= 8 && length <= 12) {
						score += 5;
					}
					else if(length >= 13 && length <= 16) {
						score += 8;
					}
					else if(length >= 17 && length <= 20) {
						score += 10;
					}
					else if(length >= 21 && length <= 24) {
						score += 13;
					}
					else if(length >= 25 && length <= 28) {
						score += 15;
					}
					else if(length >= 29 && length <= 31) {
						score += 18;
					}
					else if(length > 31) {
						score += 20;
					}

					for(i = 0; i <= (spt.length - 1); i++) {
						if(isNaN(spt[i])) {
						if(ValidationJS.SPECIAL_CHARACTERS.indexOf(spt[i]) !== -1) {
							spechar++;
						}
						else {
						if(spt[i] == spt[i].toUpperCase()) {
							upper++;
						}
						else {
							lower++;
						}
						}
						}
						else {
							number++;
						}
					}

					score += lower;

					if(upper <= 2 && upper > 0) {
						score += 5;
					}
					else if(upper <= 5 && upper >= 3) {
						score += 8;
					}
					else if(upper <= 10 && upper >= 6) {
						score += 10;
					}
					else if(upper > 10) {
						score += 12;
					}
					else if(upper == 0) {
						score -= 2;
					}

					if(number <= 2 && number > 0) {
						score += 3;
					}
					else if(number <= 5 && number >= 3) {
						score += 5;
					}
					else if(number <= 10 && number >= 6) {
						score += 8;
					}
					else if(number > 10) {
						score += 10;
					}
					else if(number == 0) {
						score -= 2;
					}

					if(spechar > 0 && !prohibit) {
						score += 10;
					}

					for(i = 0; i <= (spt.length - 1); i++) {
						if(repetition.indexOf(spt[i]) === -1) {
							repetition.push(spt[i]);
							score++;
						}
						var low = spt[i].toLowerCase();
						if(low == "x" || low == "y" || low == "z" || low == "w" || low == "q" || low == "h" || low == "v" || low == "0") {
							score += 3;
						}
					}

					if(spt.length > repetition.length && repetition.length != 1) {
						score += (spt.length - repetition.length);
					}
					else if(spt.length == repetition.length) {
						score += (spt.length + 10);
					}
					else if(repetition.length == 1) {
						score -= 20;
					}
					else if(repetition.length == 2) {
						score -= 10;
					}

					var get = false;

					for(i = 0; i <= (patterns.length - 1); i++) {
						var pat = patterns[i].toLowerCase(),
							txt = text.toLowerCase();

							if(txt.includes(pat)) {
								get = true;
								score -= 10;
							}
					}

					if(!get) {
						score += 10;
					}

					if(score > 40) {
						score += 20;
					}

				}

				return score;
			};

			if(min_num > 0) {

				var hit = 0;

				if(spt.length > 0) {

					for(j = 0; j <= (spt.length - 1); j++) {
						if(ValidationJS.NUMBERS.indexOf(parseInt(spt[j])) !== -1) {
							hit++;
						}
					}

				}

				if(hit < min_num) {
					continuation = false;
					msg = 'Password requires ' + min_num + ' or more number' + (min_num > 1 ? 's' : '') + '.';
				}

			}

			if(continuation) {

				if(min_uppercase > 0) {

					var hit = 0;

					if(spt.length > 0) {

						for(j = 0; j <= (spt.length - 1); j++) {
							if(ValidationJS.UPPERCASE_LETTERS.indexOf(spt[j]) !== -1) {
								hit++;
							}
						}

					}

					if(hit < min_uppercase) {
						continuation = false;
						msg = 'Password requires ' + min_uppercase + ' or more upper case letter' + (min_uppercase > 1 ? 's' : '') + '.';
					}

				}

			}

			if(continuation && strength) {

				var score = calculate_score(text);

				if(score <= 40) {
					msg = 'Password is weak enough to be unsecured.';
				}

			}	

		return ValidationJS.extend({

			getStrengthScore: function() {
				return calculate_score(text);
			},

			getStrengthLabel: function() {
				var score = calculate_score(text),
					label = "";

					if(score <= 30) {
						label = "Very Weak";
					}
					else if(score <= 40 && score >= 31) {
						label = "Weak";
					}
					else if(score <= 60 && score >= 41) {
						label = "Moderate";
					}
					else if(score <= 80 && score >= 61) {
						label = "Strong";
					}
					else if(score >= 81) {
						label = "Very Strong";
					}

					return label;
			},

			isStrengthWeak: function() {
				return calculate_score(text) <= 40 ? true : false;
			}

		}, new ValidationJS.test({

			name: ValidationJS.define(arg.name, "Password"),

			text: text,

			minlength: ValidationJS.define(arg.min_length, 8),

			maxlength: ValidationJS.define(arg.max_length, 31),

			noerror_msg: (msg.length != 0) ? msg : null,

			minword: 1,

			maxword: 1,

			nospaces: true,

			optional: ValidationJS.define(arg.optional, false),

			prohibit: ValidationJS.define(arg.specialchar_prohibit, false) ? ValidationJS.SPECIAL_CHARACTERS : []

		}));
	},

	text: function(arg) {
		return new ValidationJS.test({

			name: ValidationJS.define(arg.name, "Text"),

			text: ValidationJS.define(arg.text, null),

			minlength: ValidationJS.define(arg.min_length, 1),

			maxlength: ValidationJS.define(arg.max_length, 1000),

			minword: 0,

			maxword: 1000000,

			maxline: 1000000,

			optional: ValidationJS.define(arg.optional, false),

			prohibit: ValidationJS.define(arg.nospechar, false) ? ValidationJS.SPECIAL_CHARACTERS : []

		});
	},

	username: function(arg) {
		return new ValidationJS.test({

			name: "Username",

			text: ValidationJS.define(arg.username, null),

			optional: ValidationJS.define(arg.optional, false),

			minlength: ValidationJS.define(arg.min_length, 6),

			maxlength: ValidationJS.define(arg.max_length, 24),

			minline: 1,

			maxline: 1,

			minword: 1,

			maxword: 1,

			nospaces: true,

			prohibit: ValidationJS.SPECIAL_CHARACTERS,

			prohibit_except: ['_','.']

		});
	},

	mobile: function(arg) {
		var code = ValidationJS.define(arg.country_code, null),
			separator = ValidationJS.define(arg.separator, false),
			pattern = separator ? "--,-,---,-,----" : "---------";
			
			if(code) {
				pattern = "+" + code.toString() + "," + pattern;
			}
			else {
				pattern = "09," + pattern;
			}

		return new ValidationJS.test({

			name: "Mobile number",

			text: ValidationJS.define(arg.mobile, null),

			optional: ValidationJS.define(arg.optional, false),

			minlength: 1,

			maxlength: 15,

			minline: 1,

			maxline: 1,

			pattern: pattern,

			nospaces: true,

			prohibit: ValidationJS.SPECIAL_CHARACTERS,

			prohibit_except: ['-','+']

		});
	},

	name: function(arg) {
		var invalid = [],
			spechar = ValidationJS.SPECIAL_CHARACTERS,
			numeric = ValidationJS.NUMBERS;

			for(i = 0; i <= (spechar.length - 1); i++) {
				invalid.push(spechar[i].toString());
			}

			for(i = 0; i <= (numeric.length - 1); i++) {
				invalid.push(numeric[i].toString());
			}

		return new ValidationJS.test({

			name: ValidationJS.define(arg.name, "Name"),

			text: ValidationJS.define(arg.text, null),

			minline: 1,

			maxline: 1,

			minword: 1,

			maxword: 5,

			minlength: 1,

			maxlength: 255,

			nospaces: false,

			prohibit: invalid,

			prohibit_except: ['.','-'],

			optional: ValidationJS.define(arg.optional, false)

		});
	},

	url: function(arg) {
	var pattern = "",
		msg = "",
		url = ValidationJS.define(arg.url, null),
		protocol = ValidationJS.define(arg.protocol, false),
		secure = ValidationJS.define(arg.secure, false),
		www = ValidationJS.define(arg.www, false),
		all = ValidationJS.define(arg.all_format, false),
		ext = ValidationJS.define(arg.extension, []),
		origin = ValidationJS.define(arg.origin, []),
		params = [],
		host = null;

		if(!all) {
		if(protocol) {
			pattern += "http";
			if(secure) {
				pattern += "s";
			}
			pattern += "://";
		}

		if(www) {
			pattern += "www.";
		}

		pattern += ",-*,.,-*";
		}
		else {
			pattern = null;
		}

		var param = url.split("?")[1];

			if(param) {

				param = param.split("#")[0].split("&");

				if(param.length > 0) {

					for(i = 0; i <= (param.length - 1); i++) {
						var item = param[i].split("=");
						params.push({
							name: item[0],
							value: item[1]
						});
					}

				}

			}

		var continuation = true;	

		if(ext && ext.length > 0) {

			var domain = url.split("?")[0].split("."),
				last = domain[domain.length-1];

			console.log(domain[2]);

		}
		
		return ValidationJS.extend({

			getHost: function() {

			},

			getPath: function() {

			},

			getParameters: function() {
				return params;
			},

			getExtension: function() {

			},

			getProtocol: function() {

			},

			getHash: function() {

			}

		}, new ValidationJS.test({

			name: "URL",

			text: url.split("?")[0].toLowerCase(),

			optional: ValidationJS.define(arg.optional, false),

			minline: 1,

			maxline: 1,

			pattern: pattern,

			nospaces: false,

			minlength: 1,

			maxlength: 1000000,

			prohibit: ValidationJS.SPECIAL_CHARACTERS,

			prohibit_except: [".","_","/",":"],

			noerror_msg: msg

		}));
	},

	address: function(arg) {

	},

	id: function(arg) {

	},

	date: function(arg) {

	},

	form: function(arg) {

	}

};