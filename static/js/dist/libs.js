!function(e,t,n){function r(e,t,r){if(s.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=f++),-1==t.firedElems.indexOf(e._id))){if(t.options.onceOnly){if(0!==t.firedElems.length)return;t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)}t.firedElems.push(e._id),r.push({callback:t.callback,elem:e})}}function i(e,t,n){for(var o,c=0;o=e[c];c++)r(o,t,n),0<o.childNodes.length&&i(o.childNodes,t,n)}function o(e){for(var t,n=0;t=e[n];n++)t.callback.call(t.elem)}function c(e,t){e.forEach(function(e){var n=e.addedNodes,c=e.target,u=[];null!==n&&0<n.length?i(n,t,u):"attributes"===e.type&&r(c,t,u),o(u)})}function u(e,t){e.forEach(function(e){e=e.removedNodes;var n=[];null!==e&&0<e.length&&i(e,t,n),o(n)})}function l(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function a(e){return{childList:!0,subtree:!0}}function d(e){e.arrive=b.bindEvent,s.addMethod(e,"unbindArrive",b.unbindEvent),s.addMethod(e,"unbindArrive",b.unbindEventWithSelectorOrCallback),s.addMethod(e,"unbindArrive",b.unbindEventWithSelectorAndCallback),e.leave=p.bindEvent,s.addMethod(e,"unbindLeave",p.unbindEvent),s.addMethod(e,"unbindLeave",p.unbindEventWithSelectorOrCallback),s.addMethod(e,"unbindLeave",p.unbindEventWithSelectorAndCallback)}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var f=0,s=function(){var e=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(t,n){return t instanceof HTMLElement&&e.call(t,n)},addMethod:function(e,t,n){var r=e[t];e[t]=function(){return n.length==arguments.length?n.apply(this,arguments):"function"==typeof r?r.apply(this,arguments):void 0}}}}(),v=function(){var e=function(){this._eventsBucket=[],this._beforeRemoving=this._beforeAdding=null};return e.prototype.addEvent=function(e,t,n,r){return e={target:e,selector:t,options:n,callback:r,firedElems:[]},this._beforeAdding&&this._beforeAdding(e),this._eventsBucket.push(e),e},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)e(t)&&(this._beforeRemoving&&this._beforeRemoving(t),this._eventsBucket.splice(n,1))},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),h=function(t,n,r){function i(e){return"number"!=typeof e.length&&(e=[e]),e}var o=new v,c=this;return o.beforeAdding(function(n){var i,o=n.target;(o===e.document||o===e)&&(o=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var u=t(n.options);i.observe(o,u),n.observer=i,n.me=c}),o.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,r){if("undefined"==typeof r)r=t,t=n;else{var c,u={};for(c in n)u[c]=n[c];for(c in t)u[c]=t[c];t=u}for(c=i(this),u=0;u<c.length;u++)o.addEvent(c[u],e,t,r)},this.unbindEvent=function(){var e=i(this);o.removeEvent(function(t){for(var n=0;n<e.length;n++)if(t.target===e[n])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t=i(this);o.removeEvent("function"==typeof e?function(n){for(var r=0;r<t.length;r++)if(n.target===t[r]&&n.callback===e)return!0;return!1}:function(n){for(var r=0;r<t.length;r++)if(n.target===t[r]&&n.selector===e)return!0;return!1})},this.unbindEventWithSelectorAndCallback=function(e,t){var n=i(this);o.removeEvent(function(r){for(var i=0;i<n.length;i++)if(r.target===n[i]&&r.selector===e&&r.callback===t)return!0;return!1})},this},b=new h(l,{fireOnAttributesModification:!1,onceOnly:!1},c),p=new h(a,{},u);t&&d(t.fn),d(HTMLElement.prototype),d(NodeList.prototype),d(HTMLCollection.prototype),d(HTMLDocument.prototype),d(Window.prototype)}}(this,"undefined"==typeof jQuery?null:jQuery,void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFycml2ZS5taW4uanMiXSwibmFtZXMiOlsibiIsInEiLCJ2IiwiciIsImEiLCJiIiwiYyIsImUiLCJtYXRjaGVzU2VsZWN0b3IiLCJzZWxlY3RvciIsIl9pZCIsInciLCJmaXJlZEVsZW1zIiwiaW5kZXhPZiIsIm9wdGlvbnMiLCJvbmNlT25seSIsImxlbmd0aCIsIm1lIiwidW5iaW5kRXZlbnRXaXRoU2VsZWN0b3JBbmRDYWxsYmFjayIsImNhbGwiLCJ0YXJnZXQiLCJjYWxsYmFjayIsInB1c2giLCJlbGVtIiwicCIsImYiLCJkIiwiY2hpbGROb2RlcyIsInQiLCJ4IiwiZm9yRWFjaCIsImFkZGVkTm9kZXMiLCJ0eXBlIiwieSIsInJlbW92ZWROb2RlcyIsInoiLCJhdHRyaWJ1dGVzIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImZpcmVPbkF0dHJpYnV0ZXNNb2RpZmljYXRpb24iLCJBIiwiayIsImFycml2ZSIsImwiLCJiaW5kRXZlbnQiLCJhZGRNZXRob2QiLCJ1bmJpbmRFdmVudCIsInVuYmluZEV2ZW50V2l0aFNlbGVjdG9yT3JDYWxsYmFjayIsImxlYXZlIiwibSIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJIVE1MRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsImFyZ3VtZW50cyIsImFwcGx5IiwidGhpcyIsIkIiLCJfZXZlbnRzQnVja2V0IiwiX2JlZm9yZVJlbW92aW5nIiwiX2JlZm9yZUFkZGluZyIsImFkZEV2ZW50IiwicmVtb3ZlRXZlbnQiLCJzcGxpY2UiLCJiZWZvcmVBZGRpbmciLCJiZWZvcmVSZW1vdmluZyIsInUiLCJoIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImciLCJvYnNlcnZlIiwib2JzZXJ2ZXIiLCJkaXNjb25uZWN0IiwiZm4iLCJOb2RlTGlzdCIsIkhUTUxDb2xsZWN0aW9uIiwiSFRN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LFFBQUEsR0FBQSxTQUFBRSxHQUFBLElBQUEsR0FBQW9CLEdBQUEsRUFBQUEsRUFBQXJCLEVBQUFXLE9BQUFVLElBQUEsR0FBQXBCLEVBQUFjLFNBQUFmLEVBQUFxQixJQUFBcEIsRUFBQUcsV0FBQUwsRUFBQSxPQUFBLENBQUEsUUFBQSxLQUFBdUQsS0FBQXpDLG1DQUFBLFNBQUFkLEVBQUFDLEdBQUEsR0FBQUMsR0FBQW9CLEVBQUFpQyxLQUFBbEMsR0FBQXdDLFlBQUEsU0FBQXZDLEdBQUEsSUFBQSxHQUFBbkIsR0FBQSxFQUFBQSxFQUFBRCxFQUFBVSxPQUFBVCxJQUFBLEdBQUFtQixFQUFBTixTQUFBZCxFQUFBQyxJQUFBbUIsRUFBQWpCLFdBQUFMLEdBQUFzQixFQUFBTCxXQUFBaEIsRUFBQSxPQUFBLENBQUEsUUFBQSxLQUFBc0QsTUFDQWhCLEVBQUEsR0FBQTBCLEdBQUFsQyxHQUFBSSw4QkFBQSxFQUFBeEIsVUFBQSxHQUFBYyxHQUFBb0IsRUFBQSxHQUFBb0IsR0FBQTdCLEtBQUFQLEVBQUFoQyxJQUFBd0MsRUFBQXhDLEVBQUE0RSxJQUFBcEMsRUFBQVUsWUFBQUMsV0FBQVgsRUFBQXFDLFNBQUExQixXQUFBWCxFQUFBc0MsZUFBQTNCLFdBQUFYLEVBQUF1QyxhQUFBNUIsV0FBQVgsRUFBQXdDLE9BQUE3QixhQUFBTyxLQUFBLG1CQUFBdUIsUUFBQSxLQUFBQSxPQUFBIiwiZmlsZSI6ImxpYnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogYXJyaXZlLmpzXG4gKiB2Mi4yLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS91emFpcmZhcm9vcS9hcnJpdmVcbiAqIE1JVCBsaWNlbnNlZFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1IFV6YWlyIEZhcm9vcVxuICovXG5cbihmdW5jdGlvbihuLHEsdil7ZnVuY3Rpb24gcihhLGIsYyl7aWYoZS5tYXRjaGVzU2VsZWN0b3IoYSxiLnNlbGVjdG9yKSYmKGEuX2lkPT09diYmKGEuX2lkPXcrKyksLTE9PWIuZmlyZWRFbGVtcy5pbmRleE9mKGEuX2lkKSkpe2lmKGIub3B0aW9ucy5vbmNlT25seSlpZigwPT09Yi5maXJlZEVsZW1zLmxlbmd0aCliLm1lLnVuYmluZEV2ZW50V2l0aFNlbGVjdG9yQW5kQ2FsbGJhY2suY2FsbChiLnRhcmdldCxiLnNlbGVjdG9yLGIuY2FsbGJhY2spO2Vsc2UgcmV0dXJuO2IuZmlyZWRFbGVtcy5wdXNoKGEuX2lkKTtjLnB1c2goe2NhbGxiYWNrOmIuY2FsbGJhY2ssZWxlbTphfSl9fWZ1bmN0aW9uIHAoYSxiLGMpe2Zvcih2YXIgZD0wLGY7Zj1hW2RdO2QrKylyKGYsYixjKSwwPGYuY2hpbGROb2Rlcy5sZW5ndGgmJnAoZi5jaGlsZE5vZGVzLGIsYyl9ZnVuY3Rpb24gdChhKXtmb3IodmFyIGI9MCxjO2M9YVtiXTtiKyspYy5jYWxsYmFjay5jYWxsKGMuZWxlbSl9ZnVuY3Rpb24geChhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIpe2EuZm9yRWFjaChmdW5jdGlvbihhKXt2YXIgZD1hLmFkZGVkTm9kZXMsZj1hLnRhcmdldCxlPVtdO251bGwhPT1kJiYwPGQubGVuZ3RoP3AoZCxiLGUpOlwiYXR0cmlidXRlc1wiPT09YS50eXBlJiZyKGYsYixlKTt0KGUpfSl9ZnVuY3Rpb24geShhLGIpe2EuZm9yRWFjaChmdW5jdGlvbihhKXthPWEucmVtb3ZlZE5vZGVzO3ZhciBkPVtdO251bGwhPT1hJiYwPGEubGVuZ3RoJiZwKGEsYixkKTt0KGQpfSl9ZnVuY3Rpb24geihhKXt2YXIgYj17YXR0cmlidXRlczohMSxjaGlsZExpc3Q6ITAsc3VidHJlZTohMH07YS5maXJlT25BdHRyaWJ1dGVzTW9kaWZpY2F0aW9uJiYoYi5hdHRyaWJ1dGVzPSEwKTtyZXR1cm4gYn1mdW5jdGlvbiBBKGEpe3JldHVybntjaGlsZExpc3Q6ITAsc3VidHJlZTohMH19ZnVuY3Rpb24gayhhKXthLmFycml2ZT1sLmJpbmRFdmVudDtlLmFkZE1ldGhvZChhLFwidW5iaW5kQXJyaXZlXCIsbC51bmJpbmRFdmVudCk7ZS5hZGRNZXRob2QoYSxcInVuYmluZEFycml2ZVwiLFxuXHRsLnVuYmluZEV2ZW50V2l0aFNlbGVjdG9yT3JDYWxsYmFjayk7ZS5hZGRNZXRob2QoYSxcInVuYmluZEFycml2ZVwiLGwudW5iaW5kRXZlbnRXaXRoU2VsZWN0b3JBbmRDYWxsYmFjayk7YS5sZWF2ZT1tLmJpbmRFdmVudDtlLmFkZE1ldGhvZChhLFwidW5iaW5kTGVhdmVcIixtLnVuYmluZEV2ZW50KTtlLmFkZE1ldGhvZChhLFwidW5iaW5kTGVhdmVcIixtLnVuYmluZEV2ZW50V2l0aFNlbGVjdG9yT3JDYWxsYmFjayk7ZS5hZGRNZXRob2QoYSxcInVuYmluZExlYXZlXCIsbS51bmJpbmRFdmVudFdpdGhTZWxlY3RvckFuZENhbGxiYWNrKX1pZihuLk11dGF0aW9uT2JzZXJ2ZXImJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgSFRNTEVsZW1lbnQpe3ZhciB3PTAsZT1mdW5jdGlvbigpe3ZhciBhPUhUTUxFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzfHxIVE1MRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yfHxIVE1MRWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yfHxIVE1MRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3I7XG5cdFx0cmV0dXJue21hdGNoZXNTZWxlY3RvcjpmdW5jdGlvbihiLGMpe3JldHVybiBiIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQmJmEuY2FsbChiLGMpfSxhZGRNZXRob2Q6ZnVuY3Rpb24oYSxjLGQpe3ZhciBmPWFbY107YVtjXT1mdW5jdGlvbigpe2lmKGQubGVuZ3RoPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBkLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBmKXJldHVybiBmLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19fX0oKSxCPWZ1bmN0aW9uKCl7dmFyIGE9ZnVuY3Rpb24oKXt0aGlzLl9ldmVudHNCdWNrZXQ9W107dGhpcy5fYmVmb3JlUmVtb3Zpbmc9dGhpcy5fYmVmb3JlQWRkaW5nPW51bGx9O2EucHJvdG90eXBlLmFkZEV2ZW50PWZ1bmN0aW9uKGEsYyxkLGYpe2E9e3RhcmdldDphLHNlbGVjdG9yOmMsb3B0aW9uczpkLGNhbGxiYWNrOmYsZmlyZWRFbGVtczpbXX07dGhpcy5fYmVmb3JlQWRkaW5nJiZ0aGlzLl9iZWZvcmVBZGRpbmcoYSk7dGhpcy5fZXZlbnRzQnVja2V0LnB1c2goYSk7XG5cdFx0cmV0dXJuIGF9O2EucHJvdG90eXBlLnJlbW92ZUV2ZW50PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYz10aGlzLl9ldmVudHNCdWNrZXQubGVuZ3RoLTEsZDtkPXRoaXMuX2V2ZW50c0J1Y2tldFtjXTtjLS0pYShkKSYmKHRoaXMuX2JlZm9yZVJlbW92aW5nJiZ0aGlzLl9iZWZvcmVSZW1vdmluZyhkKSx0aGlzLl9ldmVudHNCdWNrZXQuc3BsaWNlKGMsMSkpfTthLnByb3RvdHlwZS5iZWZvcmVBZGRpbmc9ZnVuY3Rpb24oYSl7dGhpcy5fYmVmb3JlQWRkaW5nPWF9O2EucHJvdG90eXBlLmJlZm9yZVJlbW92aW5nPWZ1bmN0aW9uKGEpe3RoaXMuX2JlZm9yZVJlbW92aW5nPWF9O3JldHVybiBhfSgpLHU9ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7XCJudW1iZXJcIiE9PXR5cGVvZiBhLmxlbmd0aCYmKGE9W2FdKTtyZXR1cm4gYX12YXIgZj1uZXcgQixlPXRoaXM7Zi5iZWZvcmVBZGRpbmcoZnVuY3Rpb24oYil7dmFyIGQ9Yi50YXJnZXQsaDtpZihkPT09bi5kb2N1bWVudHx8ZD09PW4pZD1cblx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImh0bWxcIilbMF07aD1uZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihhKXtjLmNhbGwodGhpcyxhLGIpfSk7dmFyIGc9YShiLm9wdGlvbnMpO2gub2JzZXJ2ZShkLGcpO2Iub2JzZXJ2ZXI9aDtiLm1lPWV9KTtmLmJlZm9yZVJlbW92aW5nKGZ1bmN0aW9uKGEpe2Eub2JzZXJ2ZXIuZGlzY29ubmVjdCgpfSk7dGhpcy5iaW5kRXZlbnQ9ZnVuY3Rpb24oYSxjLGgpe2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgaCloPWMsYz1iO2Vsc2V7dmFyIGc9e30sZTtmb3IoZSBpbiBiKWdbZV09YltlXTtmb3IoZSBpbiBjKWdbZV09Y1tlXTtjPWd9ZT1kKHRoaXMpO2ZvcihnPTA7ZzxlLmxlbmd0aDtnKyspZi5hZGRFdmVudChlW2ddLGEsYyxoKX07dGhpcy51bmJpbmRFdmVudD1mdW5jdGlvbigpe3ZhciBhPWQodGhpcyk7Zi5yZW1vdmVFdmVudChmdW5jdGlvbihiKXtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKylpZihiLnRhcmdldD09PWFbY10pcmV0dXJuITA7XG5cdFx0cmV0dXJuITF9KX07dGhpcy51bmJpbmRFdmVudFdpdGhTZWxlY3Rvck9yQ2FsbGJhY2s9ZnVuY3Rpb24oYSl7dmFyIGI9ZCh0aGlzKTtmLnJlbW92ZUV2ZW50KFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhP2Z1bmN0aW9uKGMpe2Zvcih2YXIgZD0wO2Q8Yi5sZW5ndGg7ZCsrKWlmKGMudGFyZ2V0PT09YltkXSYmYy5jYWxsYmFjaz09PWEpcmV0dXJuITA7cmV0dXJuITF9OmZ1bmN0aW9uKGMpe2Zvcih2YXIgZD0wO2Q8Yi5sZW5ndGg7ZCsrKWlmKGMudGFyZ2V0PT09YltkXSYmYy5zZWxlY3Rvcj09PWEpcmV0dXJuITA7cmV0dXJuITF9KX07dGhpcy51bmJpbmRFdmVudFdpdGhTZWxlY3RvckFuZENhbGxiYWNrPWZ1bmN0aW9uKGEsYil7dmFyIGM9ZCh0aGlzKTtmLnJlbW92ZUV2ZW50KGZ1bmN0aW9uKGQpe2Zvcih2YXIgZT0wO2U8Yy5sZW5ndGg7ZSsrKWlmKGQudGFyZ2V0PT09Y1tlXSYmZC5zZWxlY3Rvcj09PWEmJmQuY2FsbGJhY2s9PT1iKXJldHVybiEwO3JldHVybiExfSl9O3JldHVybiB0aGlzfSxcblx0bD1uZXcgdSh6LHtmaXJlT25BdHRyaWJ1dGVzTW9kaWZpY2F0aW9uOiExLG9uY2VPbmx5OiExfSx4KSxtPW5ldyB1KEEse30seSk7cSYmayhxLmZuKTtrKEhUTUxFbGVtZW50LnByb3RvdHlwZSk7ayhOb2RlTGlzdC5wcm90b3R5cGUpO2soSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlKTtrKEhUTUxEb2N1bWVudC5wcm90b3R5cGUpO2soV2luZG93LnByb3RvdHlwZSl9fSkodGhpcyxcInVuZGVmaW5lZFwiPT09dHlwZW9mIGpRdWVyeT9udWxsOmpRdWVyeSx2b2lkIDApOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==