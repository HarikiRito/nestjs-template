NAME=${PWD##*/}
find . -type f -name "sample*.*" | while read FILE; do
  newfile="${FILE//sample/$NAME}"
  mv "${FILE}" "${newfile}" ;
done

find . -type f -name "$NAME*.*" | while read FILE; do
  sed -i "s/sample/$NAME/g" "${FILE}"
  sed -i "s/Sample/${NAME^}/g" "${FILE}"
done
