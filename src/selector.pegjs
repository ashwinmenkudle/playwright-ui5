{
  function collectProperties(props, prop) {
  	var newProps = [];
    for(var i=0; i < props.length; i++) {
    }
    props = props.map(function(prop) { return {name: prop[0].name, value: prop[0].value}})
  	props.push(prop);
  	return props;
  }
  function concat(o) {
    return o.join("");
  }
}

start
  = name:ComponentName props:(Properties)? { return {compName: name, props: !props ? [] : props}}
 
ComponentName "string"
  = componentName:[a-zA-Z.]+ { return concat(componentName) }
  
Properties
  = _[\[] props:(Property [\,])* prop2:Property [\]]_ {return collectProperties(props,prop2)}
 
Property 
  = _ name:PropertyName _ [\=] _ [\"] value:PropertyValue [\"] _ {return {name: name, value: value}}
  
PropertyValue "string"
  = propVal:[^\"]* { return concat(propVal) }

PropertyName "string"
  = propName:[a-zA-Z0-9]+ { return concat(propName) }

Integer "integer"
  = _ [0-9]

_ "whitespace"
  = [ \t\n\r]*