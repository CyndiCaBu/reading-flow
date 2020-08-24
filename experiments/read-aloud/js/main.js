$(function(){
	var synth = window.speechSynthesis;
	var voiceSelect = document.querySelector('#input-select-voice');
	var voices = [];

	function populateVoiceList() {
	  voices = synth.getVoices().sort(function (a, b) {
		  const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
		  if ( aname < bname ) return -1;
		  else if ( aname == bname ) return 0;
		  else return +1;
	  });
	  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	  voiceSelect.innerHTML = '';
	  for(i = 0; i < voices.length ; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
		
		if(voices[i].default) {
		  option.textContent += ' -- DEFAULT';
		}

		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	  }
	  voiceSelect.selectedIndex = selectedIndex;
	}

	populateVoiceList();
	if (speechSynthesis.onvoiceschanged !== undefined) {
	  speechSynthesis.onvoiceschanged = populateVoiceList;
	}
	
	$('#content').on('click','.utterance',function(ev){
		console.info( this.textContent );
		var textToSay = this.textContent;
		if (synth.speaking) {
			synth.cancel()
			//console.error('speechSynthesis.speaking');
			//return;
		}
		if (textToSay === '') {
			return;
		}
		var utterThis = new SpeechSynthesisUtterance(textToSay);
		utterThis.onend = function (event) {
			console.log('SpeechSynthesisUtterance.onend');
		}
		utterThis.onerror = function (event) {
			console.error('SpeechSynthesisUtterance.onerror');
		}
		var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
		for(i = 0; i < voices.length ; i++) {
			if(voices[i].name === selectedOption) {
				utterThis.voice = voices[i];
				break;
			}
		}
		utterThis.pitch = 1.0;
		utterThis.rate = 1.0;
		synth.speak(utterThis);
	});
});

