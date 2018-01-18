export default {
	validateConfirmPassword: function(rule, value, callback){
		if (value !== this.form.password) {
			callback(new Error('Password does not match.'));
		} else {
			callback();
		}
    },
    validatePassword: function(rule, value, callback){
		if (this.form.password !== '') {
			this.$refs.form.validateField('confirmPassword');
		}
		callback();
    }
}
